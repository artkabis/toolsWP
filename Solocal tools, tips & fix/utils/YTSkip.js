const t = document?.querySelector("#movie_player");
console.log(t);
const a = t?.querySelector([".ytp-ad-skip-button", ".ytp-ad-skip-button-modern", ".ytp-ad-overlay-close-button", ".ytp-skip-ad-button", ".ytp-skip-ad-button-modern"].join(","));
console.log(a);
a && a?.click();
