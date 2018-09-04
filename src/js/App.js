import { createFrag, getElementUnderClientXY } from './utils';
import FriendsGrid from './FriendsGrid';
import SpisokGrid from './SpisokGrid';

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
  }

  addListener() {
    this.friends.Grid.addEventListener("mousedown", (e) => {
      this.onDragMouseDown(e);
    });

    this.spisok.Grid.addEventListener("mousedown", (e) => {
        this.onDragMouseDown(e);
    });

    this.saveBtn.addEventListener('click', (e) => {
      this.saveLists();
    });
  }

  onDragMouseDown(e) {
    const el  = e.target.closest('.grid-tlist-item');

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
    let app = document.createElement('div');
    app.classList.add('app');
    app.appendChild(createFrag('#app', this));

    return app;
  }

  appendBody() {
    let body = document.querySelector('body');

    if (!body) throw new Error (`<body> not found`);

    body.insertBefore(this.app, body.firstChild);
  }

  updateSingleTask(id, store) {
    if (store === 'SpisokGrid') {
      let user = this.friends.data.filter(user => user.id === id);

      this.spisok.entity.update(user).then(res => {
        this.spisok.reload();
        this.friends.entity.remove(id);
      });
    }

    if (store === 'FriendsGrid') {
      let user = this.spisok.data.filter(user => user.id === id);

      this.friends.entity.update(user).then(res => {
        this.friends.reload();
        this.spisok.entity.remove(id);

        this.spisok.reload();
      });
    }
  }

  saveLists() {
    this.friends.entity.save();
    this.spisok.entity.save();
  }
}