document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const teamSections = document.querySelectorAll(".team-section");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active from previous
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      // Show/hide sections
      teamSections.forEach((section) => {
        if (filter === "all" || section.classList.contains(filter)) {
          section.style.display = "block";
          section.style.opacity = 0;
          setTimeout(() => (section.style.opacity = 1), 100);
        } else {
          section.style.opacity = 0;
          setTimeout(() => (section.style.display = "none"), 300);
        }
      });
    });
  });
});
