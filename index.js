const openModal = document.querySelector(".hero__cta");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".modal__close");
const initGame = document.querySelector(".init__game");

// openModal.addEventListener("click", (e) => {
//   e.preventDefault();
//   modal.classList.add("modal--show");
// });

closeModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.remove('modal--show');
});
document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  modal.classList.add("modal--show");
});

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(Init, 1);
} else {
  initGame.addEventListener("click", Init);
}
