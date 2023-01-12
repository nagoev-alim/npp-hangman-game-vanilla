import words from '../data/mock.js';
import { showNotification } from '../modules/showNotification.js';

export default class App {
  constructor(root) {
    // 🚀 Props
    this.root = root;
    this.selectedWord = words[Math.floor(Math.random() * words.length)];
    this.correctLetters = [];
    this.wrongLetters = [];

    // 🚀 Render Skeleton
    this.root.innerHTML = `
      <h3 class='title'>Hangman</h3>
      <p>Find the hidden word - Enter a letter</p>

      <div class='content'>
        <div data-hint=''></div>
        <svg height='250' width='200' class='figure'>
          <line x1='60' y1='20' x2='140' y2='20' />
          <line x1='140' y1='20' x2='140' y2='50' />
          <line x1='60' y1='20' x2='60' y2='230' />
          <line x1='20' y1='230' x2='100' y2='230' />
          <circle cx='140' cy='70' r='20' class='figure__part' />
          <line x1='140' y1='90' x2='140' y2='150' class='figure__part' />
          <line x1='140' y1='120' x2='120' y2='100' class='figure__part' />
          <line x1='140' y1='120' x2='160' y2='100' class='figure__part' />
          <line x1='140' y1='150' x2='120' y2='180' class='figure__part' />
          <line x1='140' y1='150' x2='160' y2='180' class='figure__part' />
        </svg>
        <div class='wrong-letters'>
          <p class='h5 hide'>Wrong letters:</p>
          <div data-wrong-letters=''></div>
        </div>
        <div class='word' data-word=''></div>
        <button data-play='' class='hide'>Play Again</button>
      </div>
    `;

    // 🚀 Query Selectors
    this.DOM = {
      word: document.querySelector('[data-word]'),
      hint: document.querySelector('[data-hint]'),
      wrongLetters: document.querySelector('[data-wrong-letters]'),
      figureParts: document.querySelectorAll('.figure__part'),
      btnPlay: document.querySelector('[data-play]'),
    };

    // 🚀 Events Listeners
    this.displayWord();
    window.addEventListener('keydown', this.onKeyDown);
    this.DOM.btnPlay.addEventListener('click', () => location.reload());
  }

  //===============================================
  // 🚀 Methods
  //===============================================
  /**
   * @function onKeyDown - Keydown event handler
   * @param keyCode
   * @param key
   */
  onKeyDown = ({ keyCode, key }) => {
    if (keyCode >= 65 && keyCode <= 90) {

      if (this.selectedWord.word.includes(key)) {
        if (!this.correctLetters.includes(key)) {
          this.correctLetters.push(key);
          this.displayWord();
        } else {
          showNotification('warning', 'You have already entered this letter');
        }
      } else {
        if (!this.wrongLetters.includes(key)) {
          this.wrongLetters.push(key);
          this.updateLetters();
        } else {
          showNotification('warning', 'You have already entered this letter');
        }
      }
    }
  };

  //===============================================
  /**
   * @function displayWord - Display word
   */
  displayWord = () => {
    console.log(`Hint:${this.selectedWord.word}`);

    this.DOM.hint.innerHTML = `<h3 class='h5'>🚀 Hint:</h3> ${this.selectedWord.hint}`;
    this.DOM.word.innerHTML = `${this.selectedWord.word.split('').map(letter => `<span>${this.correctLetters.includes(letter) ? letter : ''}</span>`).join('')}`;

    if (this.DOM.word.innerText.replace(/\n/g, '').toLowerCase() === this.selectedWord.word.toLowerCase()) {
      window.removeEventListener('keydown', this.onKeyDown);
      this.DOM.btnPlay.classList.remove('hide');
      showNotification('success', 'Congratulations! You won!');
    }
  };

  //===============================================
  /**
   * @function updateLetters - Update figure and set wrong letters
   */
  updateLetters = () => {
    if (this.wrongLetters.length > 0) {
      document.querySelector('.wrong-letters p').classList.remove('hide');
    }

    this.DOM.wrongLetters.innerHTML = `${this.wrongLetters.map(letter => `<span class='h5'>${letter}</span>`).join('')}`;

    this.DOM.figureParts.forEach((part, index) => {
      part.style.display = index < this.wrongLetters.length ? 'block' : 'none';
    });

    if (this.wrongLetters.length === this.DOM.figureParts.length) {
      window.removeEventListener('keydown', this.onKeyDown);
      this.DOM.btnPlay.classList.remove('hide');
      showNotification('danger', 'Unfortunately you lost.');
    }
  };
}
