import { createFrag } from './utils';
import Scrollbar from './Scrollbar';

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

        this.tBody.addEventListener('click', this.toggleUser.bind(this));
    }

    findDropTarget (e) {
        if (!this.drag.currentTargetElem) {
            return null;
        }

        let elem = this.drag.currentTargetElem.closest(".grid-tlist");
        return elem;
    }

    toggleUser(e) {
        if (!e.target.classList.contains('js-add')) {
            return;
        }

        let elem = e.target.closest('.grid-tlist-item');
        let id = parseInt(elem.getAttribute("data-id"), 10);

        this.clickHandler(id);
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
        let data = { list: this.getData() };

        if (!data) {
            console.log("Данные отсутствуют!");
            return;
        }

        let items = createFrag('#items', data);

        tList.appendChild(items);

        this.tBody.replaceChild(tList, this.tList);
        this.tList = tList;

        new Scrollbar(this.tList);
    }

    clickHandler(id) {

    }

    setData(data) {
        if (!data) data = [];

        this.data = data;

        return this;
    }

    async reload() {
        let data = await this.entity.data.sort((a, b) => {
            let fullNameA = `${a.first_name} ${a.last_name}`;
            let fullNameB = `${b.first_name} ${b.last_name}`;

            return fullNameA.localeCompare(fullNameB);
        });

        this.setData(data);
        this.renderRows();
    }
}