document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const caption = document.getElementById("caption");
  const closeBtn = document.querySelector(".close-btn");
  const leftArrow = document.querySelector(".arrow.left");
  const rightArrow = document.querySelector(".arrow.right");

  const images = [...document.querySelectorAll(".gallery-item img")];
  let currentIndex = 0;
  let animating = false;

  function openModal(index) {
    currentIndex = index;
    modal.classList.add("active");
    updateModal();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function updateModal() {
    if (animating) return; // prevent spam clicks
    animating = true;

    modalImg.classList.add("fade");
    setTimeout(() => {
      modalImg.src = images[currentIndex].src;
      caption.textContent = images[currentIndex].alt || "";
      modalImg.classList.remove("fade");
      animating = false;
    }, 250);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateModal();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModal();
  }

  // 🔍 Open modal
  images.forEach((img, i) => {
    img.addEventListener("click", () => openModal(i));
  });

  // ❌ Close modal
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ⬅️➡️ Navigation buttons
  rightArrow.addEventListener("click", showNext);
  leftArrow.addEventListener("click", showPrev);

  // ⌨️ Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "Escape") closeModal();
  });

  // 📱 Swipe for mobile
  let startX = 0;
  modalImg.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
  modalImg.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) showPrev();
    if (diff < -50) showNext();
  });
});
