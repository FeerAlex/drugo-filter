import { createFrag, getElementUnderClientXY } from './utils';
import FriendsGrid from './FriendsGrid';
import SpisokGrid from './SpisokGrid';
import SpisokEntity from './SpisokEntity';
import FriendsEntity from './FriendsEntity';

export default class App {
  constructor() {
    this.friends = new FriendsGrid();
    this.spisok = new SpisokGrid();

    this.drag = {};

    this.init();
    this.addListener();

    this.onDragMouseMove = this.onDragMouseMove.bind(this);
    this.onDragMouseUp = this.onDragMouseUp.bind(this);
  }

  init() {
    this.title = 'Выберите друзей';
    this.app = this.compileDom();
    this.saveBtn = this.app.querySelector('.btn');
    this.appendBody();

    let body = document.querySelector('.modal__body');

    body.appendChild(this.friends.Grid);
    body.appendChild(this.spisok.Grid);

    this.loadData();
  }

  loadData() {
    this.friends.getEntityData().then(entity => {
      console.log(entity);
      this.friends.setData(entity.data);
      this.friends.renderRows();
    });
  }

  addListener() {
    this.friends.Grid.addEventListener("mousedown", (e) => {
      this.onDragMouseDown(e);
    });
  }

  onDragMouseDown(e) {
    const el  = e.target.closest('.grid-tlist-item');

    if (!el) return;

    this.drag.el = el;

    this.drag.coords = {
      left: e.clientX - el.getBoundingClientRect().left + pageXOffset,
      top: e.clientY - el.getBoundingClientRect().top + pageYOffset
    }

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
      if (Math.abs(e.pageX - this.drag.downX) < 5 && Math.abs(e.pageY - this.drag.downY) < 5) {
          return;  // если практически не двинули элемент - то не начинаем драг
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
    this.drag.nextElement   = this.drag.el.nextElementSibling;

    document.body.appendChild(this.drag.el);

    return true;
  }

  onDragMove(e) {
    this.drag.el.style.left = e.clientX - this.drag.coords.left + 'px';
    this.drag.el.style.top = e.clientY - this.drag.coords.top + 'px';

    this.drag.currentTargetElem = getElementUnderClientXY(this.drag.el, e.clientX, e.clientY);

    this.drag.newDropTarget = this.findDropTarget(e);

    if (this.drag.newDropTarget !== this.drag.dropTarget) {
      this.drag.dropTarget && this.drag.dropTarget.classList.remove("drag-focus");
      this.drag.newDropTarget && this.drag.newDropTarget.classList.add("drag-focus");
    }

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
    this.drag.avatar        = null;
    this.drag.dropTarget    = null;
  };

  onDragConfirm() {
    /**
     * Если вернул в ту же группу - сохранять не надо, просто отмена
     */
    if (this.drag.dropTarget.querySelector("grid-tlist") === this.drag.initialParent) {
        this.drag.dropTarget.classList.remove("drag-focus");
        this.onDragCancel();
        this.onDragEnd();
        return;
    }

    let gridName  = this.drag.dropTarget.getAttribute("data-grid-name");
    let userid = parseInt(this.drag.el.getAttribute("data-id"), 10);

    this.updateSingleTask(userid, gridName);
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

  removeDraggable (el) {
    el.classList.remove("is-dragged");
    el.style.left = "";
    el.style.top = "";
  }

  compileDom() {
    let app =  this.createAppContainer();
    app.appendChild(createFrag('#app', this));

    return app;
  }

  createAppContainer() {
    let appCont = document.createElement('div');
    appCont.classList.add('app');
    return appCont;
  }

  appendBody() {
    let body = document.querySelector('body');

    if (!body) throw new Error (`<body> not found`);

    body.insertBefore(this.app, body.firstChild);
  }

  updateSingleTask(id, store) {
    console.log(id, store);

    let res = new SpisokEntity().update();

    console.log(res);

    // return new Tasks()
    //     .update(id, Object.keys(store), Object.keys(store).map(k => { return store[k] }))
    //     .commit()
    //     .then(res => {
    //         if (!res) {
    //             this.notify.error("Не удалось обновить задачу");
    //             this.updateTasks();
    //             return res;
    //         }

    //         this.notify.success("Сохранили");
    //         this.updateTasks();

    // }).catch(err => { throw err });
  }
}