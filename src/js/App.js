import { createFrag, getElementUnderClientXY } from './modules/utils';
import FriendsGrid from './FriendsGrid';
import SpisokGrid from './SpisokGrid';

export default class App {
  constructor() {
    this.FriendsGrid = new FriendsGrid();
    this.SpisokGrid = new SpisokGrid();

    this.drag = {};

    this.onDragMouseMove = this.onDragMouseMove.bind(this);
    this.onDragMouseUp = this.onDragMouseUp.bind(this);

    this.init();
    this.addListener();
  }

  init() {
    this.title = 'Выберите друзей';
    this.app = this.compileDom();
    this.saveBtn = this.app.querySelector('.btn');
    this.appendBody();

    let body = document.querySelector('.modal__body');

    body.appendChild(this.FriendsGrid.Grid);
    body.appendChild(this.SpisokGrid.Grid);
  }

  addListener() {
    this.FriendsGrid.Grid.addEventListener("mousedown", (e) => {
      this.onDragMouseDown(e);
    });

    this.SpisokGrid.Grid.addEventListener("mousedown", (e) => {
      this.onDragMouseDown(e);
    });

    this.FriendsGrid.clickHandler = (id) => {
      this.updateGrids(id, 'FriendsGrid', 'SpisokGrid');
    };

    this.SpisokGrid.clickHandler = (id) => {
      this.updateGrids(id, 'SpisokGrid', 'FriendsGrid');
    };

    this.saveBtn.addEventListener('click', (e) => {
      this.saveLists();
    });
  }

  onDragMouseDown(e) {
    const el = e.target.closest('.grid-tlist-item');

    if (!el) return;

    this.drag.el = el;

    this.drag.coords = {
      left: e.clientX - el.getBoundingClientRect().left + pageXOffset,
      top: e.clientY - el.getBoundingClientRect().top + pageYOffset
    };

    e.preventDefault();

    this.drag.downX = e.pageX;
    this.drag.downY = e.pageY;

    el.ondragstart = () => { return false };

    document.addEventListener("mousemove", this.onDragMouseMove);
    document.addEventListener("mouseup", this.onDragMouseUp);
  }

  onDragMouseMove(e) {
    if (!this.drag.el) return;

    if (!this.drag.avatar) { // начали двигать или нет
      // если практически не двинули элемент - то не начинаем драг
      if (Math.abs(e.pageX - this.drag.downX) < 5 && Math.abs(e.pageY - this.drag.downY) < 5) {
        return;
      }

      this.drag.avatar = this.onDragStart();

      if (!this.drag.avatar) {
        this.cleanUpDragObject();
        return;
      }
    }

    this.onDragMove(e);
  }

  onDragStart() {
    this.drag.el.classList.add("is-dragged");
    this.drag.initialParent = this.drag.el.parentElement;
    this.drag.nextElement = this.drag.el.nextElementSibling;
    this.drag.el.style.width = '279px';

    document.body.appendChild(this.drag.el);

    return true;
  }

  onDragMove(e) {
    this.drag.el.style.left = e.clientX - this.drag.coords.left + 'px';
    this.drag.el.style.top = e.clientY - this.drag.coords.top + 'px';

    this.drag.currentTargetElem = getElementUnderClientXY(this.drag.el, e.clientX, e.clientY);

    this.drag.newDropTarget = this.findDropTarget(e);

    this.drag.dropTarget = this.drag.newDropTarget;

    return false;
  }

  findDropTarget(e) {
    if (!this.drag.currentTargetElem) {
      return null;
    }

    let el = this.drag.currentTargetElem.closest('.grid-tlist');

    return el;
  };

  onDragMouseUp() {

    if (this.drag.avatar) {
      if (this.drag.dropTarget) {
        this.onDragConfirm();
      } else {
        this.onDragCancel();
      }
    }

    this.cleanUpDragObject();
    this.onDragEnd();
  };

  cleanUpDragObject() {
    this.drag.avatar = null;
    this.drag.dropTarget = null;
  };

  onDragConfirm() {
    if (this.drag.dropTarget === this.drag.initialParent) {
      this.onDragCancel();
      this.onDragEnd();
      return;
    }

    let toGrid = this.drag.dropTarget.getAttribute("data-grid-name");
    let fromGrid = this.drag.initialParent.getAttribute("data-grid-name");
    let userid = parseInt(this.drag.el.getAttribute("data-id"), 10);

    this.updateGrids(userid, fromGrid, toGrid);
    this.drag.el.remove();
    this.onDragEnd();
  }

  onDragEnd() {
    document.removeEventListener("mousemove", this.onDragMouseMove);
    document.removeEventListener("mouseup", this.onDragMouseUp);
  }

  onDragCancel() {
    if (this.drag.nextElement) {
      this.drag.initialParent.insertBefore(this.drag.el, this.drag.nextElement);
    } else {
      this.drag.initialParent.appendChild(this.drag.el);
    }

    this.removeDraggable(this.drag.el);
    this.onDragEnd();
  };

  removeDraggable(el) {
    el.classList.remove("is-dragged");
    el.style.left = "";
    el.style.top = "";
    el.style.width = "";
  }

  compileDom() {
    let app = document.createElement('div');
    app.classList.add('app');
    app.appendChild(createFrag('#app', this));

    return app;
  }

  appendBody() {
    let body = document.querySelector('body');

    if (!body) throw new Error(`<body> not found`);

    body.insertBefore(this.app, body.firstChild);
  }

  async updateGrids(id, fromGrid, toGrid) {
    let user = await this[fromGrid].entity.find(id);
    await this[toGrid].entity.update(user);
    await this[fromGrid].entity.remove(id);
    await this[toGrid].reload();
    await this[fromGrid].reload();
  }

  saveLists() {
    this.FriendsGrid.entity.save();
    this.SpisokGrid.entity.save();
  }
}