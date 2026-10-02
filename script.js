document.addEventListener("DOMContentLoaded", () => {
  const heroScroll = document.querySelector(".hero-scroll");
  const heroCopy = document.querySelector(".hero-copy");
  const heroSides = document.querySelectorAll(".hero-side");
  const heroActions = document.querySelector(".hero-actions");

  const machineOne = document.querySelector(".machine-one");
  const machineTwo = document.querySelector(".machine-two");
  const machineThree = document.querySelector(".machine-three");

  const machines = [machineOne, machineTwo, machineThree].filter(Boolean);

  /* ------------------------------
     HERO MACHINE FLOATING
  ------------------------------ */

  let time = 0;

  function floatMachines() {
    time += 0.016;

    machines.forEach((machine, index) => {
      const speed = 1 + index * 0.18;
      const amplitude = 5 + index * 1.5;

      const floatY = Math.sin(time * speed) * amplitude;

      machine.style.setProperty("--float-y", `${floatY}px`);
    });

    requestAnimationFrame(floatMachines);
  }

  floatMachines();


  /* ------------------------------
     HERO SCROLL TRANSITION
  ------------------------------ */

  function updateHeroScroll() {
    if (!heroScroll) return;

    const rect = heroScroll.getBoundingClientRect();
    const totalScrollable = heroScroll.offsetHeight - window.innerHeight;

    let progress = -rect.top / totalScrollable;

    progress = Math.max(0, Math.min(1, progress));

    const fadeProgress = Math.min(progress / 0.55, 1);

    if (heroCopy) {
      heroCopy.style.opacity = 1 - fadeProgress;
      heroCopy.style.transform =
        `translate(-50%, ${-40 * fadeProgress}px)`;
    }

    heroSides.forEach((side) => {
      side.style.opacity = 1 - fadeProgress;
    });

    if (heroActions) {
      heroActions.style.opacity = 1 - fadeProgress;
      heroActions.style.transform =
        `translateX(-50%) translateY(${30 * fadeProgress}px)`;
    }

    const travel = progress * 115;

    if (machineOne) {
      machineOne.style.setProperty("--scroll-y", `${travel}px`);
      machineOne.style.setProperty("--scroll-x", `${progress * 55}px`);
      machineOne.style.setProperty("--scroll-scale", `${1 - progress * 0.04}`);
    }

    if (machineTwo) {
      machineTwo.style.setProperty("--scroll-y", `${travel + 18}px`);
      machineTwo.style.setProperty("--scroll-x", `0px`);
      machineTwo.style.setProperty("--scroll-scale", `${1 - progress * 0.06}`);
    }

    if (machineThree) {
      machineThree.style.setProperty("--scroll-y", `${travel}px`);
      machineThree.style.setProperty("--scroll-x", `${progress * -55}px`);
      machineThree.style.setProperty("--scroll-scale", `${1 - progress * 0.04}`);
    }
  }

  window.addEventListener("scroll", updateHeroScroll, { passive: true });
  updateHeroScroll();


  /* ------------------------------
     FADE SECTIONS INTO VIEW
  ------------------------------ */

  const revealElements = document.querySelectorAll(
    ".section-heading, .catalog-card, .why-grid article, .inventory-copy, .inventory-dashboard, .locations-section, .partnership-heading, .partnership-form"
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });


  /* ------------------------------
     INVENTORY BAR ANIMATION
  ------------------------------ */

  const inventoryDashboard = document.querySelector(".inventory-dashboard");
  const stockFills = document.querySelectorAll(".stock-fill");

  let inventoryAnimated = false;

  const inventoryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !inventoryAnimated) {
          inventoryAnimated = true;

          stockFills.forEach((fill, index) => {
            const level = fill.dataset.level || 0;

            setTimeout(() => {
              fill.style.width = `${level}%`;
            }, index * 180);
          });
        }
      });
    },
    {
      threshold: 0.35
    }
  );

  if (inventoryDashboard) {
    inventoryObserver.observe(inventoryDashboard);
  }


  /* ------------------------------
     MACHINE MODAL
  ------------------------------ */

  const modal = document.getElementById("machineModal");
  const modalClose = document.getElementById("modalClose");
  const modalContent = document.getElementById("modalContent");

  const machineInfo = {
    single: {
      title: "Single Door Payless",
      text: "Compact smart vending designed for modern locations with cashless payment and remote inventory visibility."
    },

    double: {
      title: "Double Door Payless",
      text: "Higher-capacity smart vending with more shelf space and flexible product selection."
    },

    generic: {
      title: "Classic Vending",
      text: "Traditional vending for dependable snack and beverage service."
    }
  };

  document.querySelectorAll("[data-machine]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.machine;
      const info = machineInfo[key];

      if (!info || !modal || !modalContent) return;

      modalContent.innerHTML = `
        <p style="font-family: Courier New, monospace; font-size: 12px; letter-spacing: 0.12em; margin-bottom: 14px;">
          GOVEND MACHINE
        </p>

        <h2 style="font-size: clamp(2.3rem, 5vw, 4.8rem); line-height: 0.95; margin-bottom: 24px;">
          ${info.title}
        </h2>

        <p style="max-width: 620px; line-height: 1.6; color: #666;">
          ${info.text}
        </p>
      `;

      modal.classList.add("is-open");
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      modal.classList.remove("is-open");
    });
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("is-open");
      }
    });
  }
});
