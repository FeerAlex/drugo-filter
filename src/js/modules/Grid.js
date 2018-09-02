export default class Grid {
    constructor(opts) {
        this.drag = {};
        this.title = "";
        this.dragged = false;
        this.data = this.data || [];
        this.entity = this.entity || {};
        this.init();
    }

    init() {
        this.createGrid();
        this.addListeners();
    }

    addListeners() {
        this.tHead.addEventListener("input", (e) => {
            this.filterGrid(e);
        });

        // this.Grid.addEventListener("mousedown", (e) => {
        //     this.onDragMouseDown(e);
        // });
    }

    findDropTarget (e) {
        if (!this.drag.currentTargetElem) {
            return null;
        }

        let elem = this.drag.currentTargetElem.closest(".grid-tList");
        return elem;
    }

    getGridElem(e) {
        return e.target.closest('.grid-tList-item');
    }

    getData() {
        return this.filtered || this.data;
    }

    isMatching (full, chunk) {
        return full.toUpperCase().indexOf(chunk.toUpperCase()) !== -1;
    }

    filterGrid(e) {
        let val = e.target.value;
        this.filtered = this.data.filter(item => this.isMatching(item.first_name, val) || this.isMatching(item.last_name, val));

        this.renderRows();
    }

    setTitleName(name) {
        this.title = name;
    }

    createGrid() {
        this.Grid = document.createElement("div");
        this.Grid.classList.add("grid");

        this.tHead = document.createElement("div");
        this.tHead.classList.add("grid-thead");

        this.tBody = document.createElement("div");
        this.tBody.classList.add("grid-tbody");

        this.tList = document.createElement("div");
        this.tList.classList.add("grid-tlist");
        this.tList.setAttribute('data-grid-name', this.constructor.name);

        this.tBody.appendChild(this.tList);

        this.Grid.appendChild(this.tHead);
        this.Grid.appendChild(this.tBody);

        this.createHeader();
        this.renderRows();
    }

    createHeader() {
        let div = document.createElement('div');
        let input = document.createElement('input');
        let span = document.createElement('span');

        let headRow = div.cloneNode();
        headRow.classList.add("grid-thead-row");

        let filterInput = input.cloneNode();
        filterInput.classList.add("grid-filter-input");
        filterInput.setAttribute("placeholder", "Начните вводить имя друга");
        let filterButton = div.cloneNode();
        filterButton.classList.add("grid-filter-btn");

        let filterBlock = div.cloneNode();
        filterBlock.classList.add("grid-filter-block");
        filterBlock.appendChild(filterInput);
        filterBlock.appendChild(filterButton);

        let headCell     = div.cloneNode();
        let headCellSpan = span.cloneNode();
        let filter = filterBlock.cloneNode(true);

        headCellSpan.classList.add("grid-thead-title");
        headCellSpan.textContent = this.title;

        headCell.classList.add("grid-thead-cell");

        headCell.appendChild(filter);
        headCell.appendChild(headCellSpan);

        headRow.appendChild(headCell);

        this.tHead.appendChild(headRow);
    }

    renderRows() {
        let tList = this.tList.cloneNode();
        let data = this.getData();

        if (!data) {
            console.log("Данные отсутствуют!");
            return;
        }

        data.map(rowData => this.createRow(tList, rowData));

        this.tBody.replaceChild(tList, this.tList);
        this.tList = tList;
    }

    createRow(tList, rowData) {
        let el = document.createElement('div');
        let source = document.querySelector('#book').innerHTML;
        let render = Handlebars.compile(source);
        let template = render(rowData);

        el.innerHTML = template;
        el.setAttribute('data-id', rowData.id);
        el.classList.add('grid-tlist-item');
        tList.appendChild(el);
    }

    setData(data) {
        if (!data) data = [];

        this.data = data;

        return this;
    }

    async reload() {
        let data = await this.entity.loadData();

        this.setData(data);
        this.renderRows();
    }
}