// import all colour images as a meta glob
const colourImages = import.meta.glob(
    './assets/colours/*.png',
    { eager: true }
)

// TOR colours 
const torColourImages = import.meta.glob(
'./assets/tor_colours/*.png',
{ eager: true }
);

// TOU colours 
const touColourImages = import.meta.glob(
'./assets/tou_colours/*.png',
{ eager: true }
);

// create easily indexable array of colours 
// map file name and source to name and path for each colour within array
export const base_colours = Object.entries(colourImages).map(([path, module]) => {
const name = path.split('/').pop().replace('.png', '');

// each colour will have a name and source file path
return {
    name,
    src: module.default,
    alignment: "none",
    note: "",
    vented: false
};
});

// The Other Roles colours
export const tor_colours = Object.entries(torColourImages).map(([path, module]) => {
const name = path.split('/').pop().replace('.png', '');

// each colour will have a name and source file path
return {
    name,
    src: module.default,
    alignment: "none",
    note: "",
    vented: false
};
});

// Town Of Us colours
export const tou_colours = Object.entries(touColourImages).map(([path, module]) => {
const name = path.split('/').pop().replace('.png', '');

// each colour will have a name and source file path
return {
    name,
    src: module.default,
    alignment: "none",
    note: "",
    vented: false
};
});


export const alignmentColours = {
    imposter: {
        base: "red",
        dark: "rgb(125, 13, 17)"
    },
    crew: {
        base: "rgb(138, 254, 252)",
        dark: "rgb(69, 127, 126)"
    },
    neutral: {
        base: "rgb(255, 0, 255)",
        dark: "rgb(128, 0, 128)"
    }
};