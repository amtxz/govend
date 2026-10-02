document.addEventListener("DOMContentLoaded", () => {
  const heroScroll = document.querySelector(".hero-scroll");
  const heroCopy = document.querySelector(".hero-copy");
  const heroSides = document.querySelectorAll(".hero-side");
  const heroActions = document.querySelector(".hero-actions");

  const machineOne = document.querySelector(".machine-one");
  const machineTwo = document.querySelector(".machine-two");
  const machineThree = document.querySelector(".machine-three");

  const machines = [machineOne, machineTwo, machineThree].filter(Boolean);
const machineStage = document.querySelector(".machine-stage");

const catalogTargets = {
  single: document.querySelector(
    '.catalog-card[data-machine="single"] .catalog-machine-image'
  ),
  double: document.querySelector(
    '.catalog-card[data-machine="double"] .catalog-machine-image'
  ),
  generic: document.querySelector(
    '.catalog-card[data-machine="generic"] .catalog-machine-image'
  )
};
  let machineLandingData = null;

function calculateMachineLandingData() {
  if (!machineStage) return;

  const stageRect = machineStage.getBoundingClientRect();

  const getData = (machine, target) => {
    if (!machine || !target) return null;

    const targetRect = target.getBoundingClientRect();

    const startCenterX =
      stageRect.left + machine.offsetLeft + machine.offsetWidth / 2;

    const startCenterY =
      stageRect.top + machine.offsetTop + machine.offsetHeight / 2;

    const targetCenterX =
      targetRect.left + targetRect.width / 2;

    const targetCenterY =
      targetRect.top + targetRect.height / 2;

    return {
      x: targetCenterX - startCenterX,
      y: targetCenterY - startCenterY,
      scale: targetRect.width / machine.offsetWidth
    };
  };

  machineLandingData = {
    single: getData(machineOne, catalogTargets.single),
    double: getData(machineTwo, catalogTargets.double),
    generic: getData(machineThree, catalogTargets.generic)
  };
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

/* Hero machines are visual only — clicking them does nothing */
machines.forEach((machine) => {
  machine.style.pointerEvents = "none";
  machine.style.cursor = "default";
});
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

    /* --------------------------------
   MACHINES TRAVEL INTO THE CATALOG
-------------------------------- */

const landingProgress = clamp((progress - 0.28) / 0.72);

const transitionMachine = (machine, destination) => {
  if (!machine || !destination) return;

  const moveX = lerp(0, destination.x, landingProgress);
  const moveY = lerp(0, destination.y, landingProgress);
  const scale = lerp(1, destination.scale, landingProgress);

  machine.style.setProperty("--scroll-x", `${moveX}px`);
  machine.style.setProperty("--scroll-y", `${moveY}px`);
  machine.style.setProperty("--scroll-scale", scale);

  const fadeOut = clamp((landingProgress - 0.92) / 0.08);
  machine.style.opacity = 1 - fadeOut;
};
transitionMachine(
  machineOne,
  machineLandingData?.single
);

transitionMachine(
  machineTwo,
  machineLandingData?.double
);

transitionMachine(
  machineThree,
  machineLandingData?.generic
);
  }
calculateMachineLandingData();

window.addEventListener("resize", () => {
  calculateMachineLandingData();
  updateHeroScroll();
});
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
   LIVE INVENTORY SIMULATION
------------------------------ */

const inventoryItems = Array.from(
  document.querySelectorAll(".inventory-item")
);

let inventoryLevels = [82, 61, 34, 18];

  function animatePercentage(element, newValue) {
  const currentValue = parseInt(element.textContent) || newValue;
  const difference = newValue - currentValue;
  const duration = 650;
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const value = Math.round(
      currentValue + difference * progress
    );

    element.textContent = `${value}%`;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }

  requestAnimationFrame(updateNumber);
}

function updateInventoryDisplay() {
  let hasLowInventory = false;

  inventoryItems.forEach((item, index) => {
    const level = inventoryLevels[index];

    const fill = item.querySelector(".stock-fill");
    const percentage = item.querySelector("span");
    if (fill) {
      fill.style.width = `${level}%`;

      if (level < 18) {
        fill.style.background = "#ff3b30";
        hasLowInventory = true;
      } else {
        fill.style.background = "var(--green)";
      }
    }

    if (percentage) {
      animatePercentage(percentage, level);

      if (level < 18) {
        percentage.style.color = "#ff3b30";
      } else {
        percentage.style.color = "#ffffff";
      }
    }
  });

  const restockAlert = document.querySelector(".restock-alert");

  if (restockAlert) {
    if (hasLowInventory) {
      restockAlert.classList.add("is-active");
    } else {
      restockAlert.classList.remove("is-active");
    }
  }
}

function simulateInventoryActivity() {
  inventoryLevels = inventoryLevels.map((level) => {
    const changeAmount = Math.floor(Math.random() * 8) + 2;

    let shouldIncrease;

    if (level < 30) {
      shouldIncrease = Math.random() < 0.7;
    } else if (level > 80) {
      shouldIncrease = Math.random() < 0.3;
    } else {
      shouldIncrease = Math.random() < 0.5;
    }

    if (shouldIncrease) {
      return Math.min(100, level + changeAmount);
    } else {
      return Math.max(5, level - changeAmount);
    }
  });

  updateInventoryDisplay();
}

let inventorySimulationStarted = false;

const liveInventoryObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !inventorySimulationStarted) {
        inventorySimulationStarted = true;

        updateInventoryDisplay();

        setInterval(simulateInventoryActivity, 1100);
      }
    });
  },
  {
    threshold: 0.35
  }
);

if (inventoryDashboard) {
  liveInventoryObserver.observe(inventoryDashboard);
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

document.querySelectorAll(".catalog-card[data-machine]").forEach((button) => {
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
