// Get the modal
const modal = document.querySelector(".order-information");
const backdrop = document.getElementById("backdrop");

// Get the button that opens the modal
const btn = document.getElementById("pre-order-btn");

const closeModalBtn = document.querySelector(".close-modal");
console.log(closeModalBtn);

btn.onclick = (event) => {
  event.preventDefault();
  backdrop.style.display = "block";
  modal.style.display = "block";
};

closeModalBtn.onclick = () => {
  modal.style.display = "none";
  backdrop.style.display = "none";
};

window.addEventListener("click", (event) => {
  if (event.target == backdrop) {
    modal.style.display = "none";
    backdrop.style.display = "none";
  }
});
