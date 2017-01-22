var state = {
  'size': [],
  'items': []
};
var d = localStorage.getItem('game');
if (d) {
  state = JSON.parse(localStorage.getItem('game'));
}

window.addEventListener('load', function windowLoader() {
  'use strict';
  var input = document.querySelector('.count');
  var btnGenerate = document.querySelector('.generateField');
  var btnStartNewGame = document.querySelector('.startNewGame');
  var errorMessage = document.querySelector('.error-message');
  var startGame = document.querySelector('.startGame');
  var mainGame = document.querySelector('.mainGame');
  var winnerMessage = document.querySelector('.winner-message');
  var row;
  var cell;
  var field = document.querySelector('.field');
  var i;
  var j;
  var cells;

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function clearData() {
    field = document.querySelector('.field');
    while (field.lastChild) {
      field.removeChild(field.lastChild);
    }
    startGame.style.display = 'inline-block';
    mainGame.style.display = 'none';
    localStorage.clear('game');
    state.size.length = 0;
    state.items.length = 0;
  }

  function fieldGeneration(x) {
    state.size.length = 0;
    state.size.push(+x);
    winnerMessage.innerHTML = '';
    field = document.querySelector('.field');
    startGame.style.display = 'none';
    mainGame.style.display = 'inline';
    for (i = 0; i < x; i++) {
      row = document.createElement('div');
      row.className = 'row';
      field.appendChild(row);
      for (j = 0; j < x; j++) {
        cell = document.createElement('div');
        cell.className = 'cell';
        row.appendChild(cell);
      }
    }
  }

  function updateFromState() {
    var nextMove = 'x';
    cells = document.querySelectorAll('.cell');
    for (i = 0; i < state.items.length; i++) {
      if (nextMove === 'x') {
        cells[state.items[i]].classList.add('x');
        nextMove = 'o';
      } else {
        cells[state.items[i]].classList.add('o');
        nextMove = 'x';
      }
    }
    if (state.items.length === cells.length) {
      field.removeEventListener('click', clickOnFieldListener);
    }
    if (getWinner() === 'x') {
      winnerMessage.innerHTML = 'x-wins';
      field.removeEventListener('click', clickOnFieldListener);
      return;
    }
    if (getWinner() === 'o') {
      winnerMessage.innerHTML = 'o-wins';
      field.removeEventListener('click', clickOnFieldListener);
    }
  }

  function clickOnFieldListener(event) {
    var clickedCell = event.target;
    var index;
    var nextMove;
    cells = document.querySelectorAll('.cell');
    if (document.querySelectorAll('.cell.x').length <= document.querySelectorAll('.cell.o').length) {
      nextMove = 'x';
    } else {
      nextMove = 'o';
    }
    index = Array.prototype.indexOf.call(cells, clickedCell);
    if (index < 0) {
      return;
    }
    if (clickedCell.classList.contains('x') || clickedCell.classList.contains('o')) {
      return;
    }
    if (clickedCell.classList === field || clickedCell.classList === row) {
      return;
    }
    if (nextMove === 'x') {
      clickedCell.classList.add('x');
    } else {
      clickedCell.classList.add('o');
    }
    state.items.push(index);
    localStorage.setItem('game', JSON.stringify(state));
    updateFromState();
  }

  function starting(x) {
    fieldGeneration(x);

    updateFromState();

    btnStartNewGame.addEventListener('click', function startNewGameListener() {
      field.addEventListener('click', clickOnFieldListener);
      btnStartNewGame.removeEventListener('click', startNewGameListener);
      clearData();
    });
  }

  function setFieldSizeListener() {
    errorMessage.innerHTML = '';
    if (input.value < 16 && input.value >= 5 && isNumber(input.value)) {
      starting(parseInt(input.value, 10).toFixed(0));
    } else {
      errorMessage.innerHTML = 'Число маэ бути від 5 до 15';
    }
  }

  function setBtnFieldSizeListener(event) {
    if (event.keyCode === 13) {
      setFieldSizeListener();
    }
  }
  input.addEventListener('keydown', setBtnFieldSizeListener);
  btnGenerate.addEventListener('click', setFieldSizeListener);
  field.addEventListener('click', clickOnFieldListener);

  if (d) {
    starting(state.size[0]);
  }
});
