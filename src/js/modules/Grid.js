import { createFrag } from '../utils';

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
            this.filterVal = e.target.value;

            this.renderRows();
        });
    }

    findDropTarget (e) {
        if (!this.drag.currentTargetElem) {
            return null;
        }

        let elem = this.drag.currentTargetElem.closest(".grid-tlist");
        return elem;
    }

    getGridElem(e) {
        return e.target.closest('.grid-tlist-item');
    }

    getData() {
        if (this.filterVal) {
            return this.data.filter(item => this.isMatching(item.first_name, this.filterVal) || this.isMatching(item.last_name, this.filterVal));
        }

        return this.data;
    }

    isMatching (full, chunk) {
        return full.toUpperCase().indexOf(chunk.toUpperCase()) !== -1;
    }

    setTitleName(name) {
        this.title = name;
    }

    createGrid() {
        this.Grid = document.createElement('div');
        this.Grid.classList.add('grid');
        this.Grid.appendChild(createFrag('#grid', this));

        this.tHead = this.Grid.querySelector('.grid-thead');
        this.tBody = this.Grid.querySelector('.grid-tbody');
        this.tList = this.Grid.querySelector('.grid-tlist');
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
        let item = createFrag('#book', rowData);

        item.querySelector('.js-add').addEventListener('click', (e) => {
            this.clickHandler(rowData.id);
        });

        tList.appendChild(item);
    }

    clickHandler(id) {

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