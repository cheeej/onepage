// const headerEl = document.querySelector("#header");

// 페이지에 스크롤 이벤트 추가
// window.addEventListener(
//   "scroll",
//   // throttle(함수, 시간)
//   // 스크롤이 300ms마다 한번씩 실행되도록 설정
//   _.throttle(function () {
//     console.log(window.scrollY);
//     // 페이지의 스크롤 위치가 200px보다 크면...
//     if (window.scrollY > 200) {
//       gsap.to(headerEl, 0.6, {
//         opacity: 0,
//         display: "none-block",
//       });
//     } else {
//       // 페이지의 스크롤 위치가 200px보다 작으면
//       gsap.to(headerEl, 0.6, {
//         opacity: 1,
//         display: "block",
//       });
//     }
//   }, 300)
// );
/**
 *
 *  Page Annuaire - Carousel circulaire handcrafted
 *
 */
function infiniteCarousel(containerId, carouselId, activeKeyboard) {
  this.containerId = containerId;
  this.carouselId = carouselId;
  this.activeKeyboard = activeKeyboard || false;
  this.selected = $(this.carouselId + " .selected");

  // Gère le deplacement des items par ajout de classes
  (this.moveToSelected = function (element) {
    // Permet d'eviter bug si on clique plus d'une dizaine de fois sur une lettre présente sur un bord en limitant le deplacement à 1x1 lettre
    if (typeof element == "object") {
      if (element.hasClass("nextRightSecond") || element.hasClass("next")) {
        element = "next";
      } else if (
        element.hasClass("prevLeftSecond") ||
        element.hasClass("prev")
      ) {
        element = "prev";
      } else {
        var selected = element;
      }
    }

    if (typeof element == "string") {
      if (element == "next") {
        var selected = $(this.carouselId + " .selected").next();
      } else if (element == "prev") {
        var selected = $(this.carouselId + " .selected").prev();
      }
    }

    // Changement d'element selectionné en fonction de la direction

    // On reattribut les classes sur les elements pour créer l'effet de slide
    var next = $(selected).next();
    var prev = $(selected).prev();
    var prevSecond = $(prev).prev();
    var nextSecond = $(next).next();

    $(selected).removeClass().addClass("selected");

    $(prev).removeClass().addClass("prev");
    $(next).removeClass().addClass("next");

    $(nextSecond).removeClass().addClass("nextRightSecond");
    $(prevSecond).removeClass().addClass("prevLeftSecond");

    $(nextSecond).nextAll().removeClass().addClass("hideRight");
    $(prevSecond).prevAll().removeClass().addClass("hideLeft");

    // Si on va vers la droite, on prend la premiere lettre de la liste et on l'ajoute a la fin de la liste
    if (element == "next") {
      var htmlToAppend = $(this.carouselId + " > div:first-child");
      $(this.carouselId).append(htmlToAppend);
      $(this.carouselId + " > div:last-child")
        .removeClass()
        .addClass("hideRight");
    }

    // Si on va vers la gauche, on prend la derniere lettre de la liste et on l'ajoute au debut de la liste
    if (element == "prev") {
      var htmlToAppend = $(this.carouselId + " > div:last-child");
      $(this.carouselId).prepend(htmlToAppend);
      $(this.carouselId + " > div:first-child")
        .removeClass()
        .addClass("hideLeft");
    }

    // Met à jour element ciblé et lance une fonction traitement Ajax
    this.selected = $(selected);
    this.doAjaxRequest();
  }),
    // Possibilité d'insérer du contenu dans la grille en recuperant les données à aller chercher via requete Ajax
    (this.doAjaxRequest = function () {
      var ajaxUrl = this.selected.data("ajax-url");
      // Simule requete Ajax (visuel cosmétique uniquement)
      $(".awk-liste-marques").removeClass("visible");
      setTimeout(function () {
        $(".awk-liste-marques").addClass("visible");
      }, 300);
    }),
    // Initialiser les evenements
    (this.initEvents = function () {
      var that = this;

      // Events clavier | Permet de naviguer dans le carousel au clavier
      if (this.activeKeyboard) {
        $(document).keydown(function (e) {
          switch (e.which) {
            case 37: // left
              that.moveToSelected("prev");
              break;
            case 39: // right
              that.moveToSelected("next");
              break;
            default:
              return;
          }
          e.preventDefault();
        });
      }

      // Events mouse | Clic sur une lettre, on centre la lettre
      $(this.carouselId + " div").click(function () {
        that.moveToSelected($(this));
      });

      // Clic sur precedent
      $(this.containerId + " .awk-prev").click(function () {
        that.moveToSelected("prev");
      });

      // Clic sur suivant
      $(this.containerId + " .awk-next").click(function () {
        that.moveToSelected("next");
      });
    }),
    // Initialiser le carousel
    (this.init = function () {
      this.moveToSelected();
      this.initEvents();
    });
}

/*  Code du slider réutilisable en créant une nouvelle instance, avec des arguments différents   */
var carouselAlphabet = new infiniteCarousel(
  "#awk-carousel-container",
  "#awk-circular-carousel",
  true
);
carouselAlphabet.init();

// ex
$(document).ready(function () {
  $(".has-animation").each(function (index) {
    $(this)
      .delay($(this).data("delay"))
      .queue(function () {
        $(this).addClass("animate-in");
      });
  });
});
