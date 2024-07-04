/*
    Shim required for development only.
    Production - FoundryVTT loads index.js which is compiled by the Vite/Rollup.
    Development - FoundryVTT loads index.js which loads mysystem.ts.
*/

window.global = window; // Dependencies might need reference to the window.
// For Development only, load the index.js.
import './mysystem.js';