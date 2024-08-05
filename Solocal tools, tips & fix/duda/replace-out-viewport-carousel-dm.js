const carouselWidget = document.querySelectorAll(
  'div[dmle_extension="ssrimageslider"]'
);

if ("IntersectionObserver" in window && carouselWidget) {
  let observer = new IntersectionObserver(
    (entries) => {
      let mediaQuery = window.matchMedia(
        "(prefers-reduced-motion: no-preference)"
      );
      if (!mediaQuery.matches) {
        return;
      }

      for (let entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        let beginElements = entry.target.querySelectorAll("h3");
        for (let beginEl of beginElements) {
          console.log(beginEl);
          const spanTitle = document.createElement("span");
          spanTitle.addClass = "title-carousel";
          spanTitle.textContent = beginEl.textContent;
          beginEl.parentNode.replaceChild(spanTitle, beginEl);
          observer.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.5, // à 50% de l'élément visible depuis viewport
    }
  );

  for (let elem of carouselWidget) {
    observer.observe(elem);
  }
}
