/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Head from "next/head";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  IsoCell,
  XYCoord,
} from "../components/KeyBitCanvas/WorldManager/Cells";

type StyleSet = {
  [index: string]: CSSProperties;
};

type Specs = {
  mapName: string;
  mapSrc: string;
  textures: Texture[];
};

type NewSpec = {
  mapName?: string;
  mapSrc?: string;
  textures?: Texture[];
};

type Texture = {
  src: string;
  pxOff: number;
  pyOff: number;
  filledCells: [number, number][];
  renderCells: [number, number][];
  interactiveCells: interactiveCell[];
};

type interactiveCell = {
  interaction: string;
  cell: [number, number];
};

const DARK_GRAY = "#404040";
const DARKER_GRAY = "#202020";
const LIGHT_GRAY = "#C8C3BC";

const SIDEBAR_WIDTH = 300;
const SIDEBAR_PADDING = 20;
const EDITOR_MARGIN = 20;

const LOCAL_STORAGE_SAVE_NAME = "mapmakersave";

export const PIXEL_MAG = 1;

const MapMaker = () => {
  const [specs, setSpecs] = useState<Specs>({
    mapName: "",
    mapSrc: "",
    textures: [],
  });

  const updateSpecs = (newSpec: NewSpec) => {
    setSpecs({ ...specs, ...newSpec });
  };

  const [fillMode, setFillMode] = useState<number>(-1);

  const [cellMode, setCellMode] = useState<number>(-1);

  const [zoom, setZoom] = useState<number>(4);

  const getTextures = () => {
    const { textures } = specs;
    const elements = [];
    for (let i = 0; i < textures.length; i++) {
      elements.push(
        <Texture
          key={i}
          index={i}
          specs={specs}
          updateSpecs={updateSpecs}
          fillMode={fillMode}
          setFillMode={setFillMode}
          zoom={zoom}
        />
      );
    }
    return elements;
  };

  const getCells = () => {
    if (fillMode === -1) return <></>;
    const cells: JSX.Element[] = [];

    specs.textures[fillMode].filledCells.forEach((cell) => {
      const { x, y } = new IsoCell(...cell).toXYCoord();
      cells.push(
        <img
          src="/redselector.png"
          style={{
            position: "absolute",
            zIndex: 2,
            left:
              x -
              PIXEL_MAG +
              (EDITOR_MARGIN + SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING) / zoom,
            top: y + EDITOR_MARGIN / zoom - PIXEL_MAG,
            zoom,
            imageRendering: "pixelated",
          }}
        />
      );
    });

    specs.textures[fillMode].renderCells.forEach((cell) => {
      const { x, y } = new IsoCell(...cell).toXYCoord();
      cells.push(
        <img
          src="/yellowselector.png"
          style={{
            position: "absolute",
            zIndex: 2,
            left:
              x -
              PIXEL_MAG +
              (EDITOR_MARGIN + SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING) / zoom,
            top: y + EDITOR_MARGIN / zoom - PIXEL_MAG,
            zoom,
            imageRendering: "pixelated",
          }}
        />
      );
    });

    for (let i = 0; i < specs.textures[fillMode].interactiveCells.length; i++) {
      const icell = specs.textures[fillMode].interactiveCells[i];

      const { cell, interaction } = icell;
      const { x, y } = new IsoCell(...cell).toXYCoord();
      cells.push(
        <img
          id={`${interaction}-${i}`}
          src="/blueselector.png"
          style={{
            position: "absolute",
            zIndex: 2,
            left:
              x -
              PIXEL_MAG +
              (EDITOR_MARGIN + SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING) / zoom,
            top: y + EDITOR_MARGIN / zoom - PIXEL_MAG,
            zoom,
            imageRendering: "pixelated",
          }}
        />
      );
    }

    return cells;
  };

  useEffect(() => {
    const loadVal = localStorage.getItem(LOCAL_STORAGE_SAVE_NAME);
    if (!loadVal) return;
    try {
      const loadObj = JSON.parse(loadVal);
      setSpecs(loadObj);
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SAVE_NAME, JSON.stringify(specs));
  });

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
          background-color: white;
        }
      `}</style>
      <Head>
        <title>Map Maker</title>
        <meta
          name="description"
          content="Make a full custom map in Ben Key's style!"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <link rel="icon" href="/houseicon.png" />
      </Head>
      <main style={styles.main}>
        <SideBar
          specs={specs}
          updateSpecs={updateSpecs}
          fillMode={fillMode}
          setFillMode={setFillMode}
        />
        <div
          id="editor_space"
          style={styles.editorSpace}
          onMouseMove={(ev) => {
            const selector = document.getElementById("selector");
            if (!selector) return;
            if (fillMode === -1) {
              selector.style.display = "none";
              return;
            }
            selector.style.display = "block";

            const { clientX, clientY } = ev;

            const mouseX =
              clientX -
              SIDEBAR_WIDTH -
              2 * SIDEBAR_PADDING +
              scrollX -
              EDITOR_MARGIN;
            const mouseY = clientY + scrollY - EDITOR_MARGIN;

            const snapXY = new XYCoord(
              mouseX / zoom,
              mouseY / zoom
            ).toSnapXYCoord();
            const [snapX, snapY] = [snapXY.x, snapXY.y];

            console.log(snapX, snapY);

            selector.style.left = `${
              snapX +
              (SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING + EDITOR_MARGIN) / zoom -
              PIXEL_MAG
            }px`;
            selector.style.top = `${
              snapY + EDITOR_MARGIN / zoom - PIXEL_MAG
            }px`;
          }}
          onMouseLeave={() => {
            const selector = document.getElementById("selector");
            if (!selector) return;
            selector.style.display = "none";
          }}
          onMouseUp={() => {
            if (fillMode !== -1) return;
            const editorSpace = document.getElementById("editor_space");
            if (!editorSpace) return;
            editorSpace.onmousemove = (ev) => {};
          }}
        >
          <Map specs={specs} zoom={zoom} />
          {getTextures()}
          {getCells()}
          <Selector
            specs={specs}
            updateSpecs={updateSpecs}
            fillMode={fillMode}
            zoom={zoom}
            cellMode={cellMode}
            setCellMode={setCellMode}
          />
          <span
            style={{
              paddingLeft: SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING + EDITOR_MARGIN,
              position: "fixed",
              bottom: EDITOR_MARGIN,
              left: 0,
              zIndex: 6,
            }}
          >
            <button
              style={{
                ...styles.input,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              onClick={() => setZoom(zoom / 2)}
            >
              -
            </button>{" "}
            <button
              style={{
                ...styles.input,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              onClick={() => setZoom(zoom * 2)}
            >
              +
            </button>
          </span>
        </div>
      </main>
    </>
  );
};

const Selector = (props: {
  specs: Specs;
  updateSpecs: (newSpec: NewSpec) => void;
  fillMode: number;
  zoom: number;
  cellMode: number;
  setCellMode: Dispatch<SetStateAction<number>>;
}) => {
  const { fillMode, specs, updateSpecs, zoom } = props;
  return (
    <img
      draggable="false"
      id="selector"
      src="/selector.png"
      style={{
        display: "none",
        position: "absolute",
        zIndex: 4,
        cursor: "pointer",
        left: SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING + EDITOR_MARGIN - PIXEL_MAG,
        top: EDITOR_MARGIN - PIXEL_MAG,
        zoom,
        imageRendering: "pixelated",
      }}
      onContextMenu={(e) => e.preventDefault()}
      onAuxClick={(ev) => {
        if (fillMode === -1) return;
        const { textures } = specs;
        const { filledCells, interactiveCells } = textures[fillMode];
        const { clientX, clientY } = ev;

        const x =
          clientX -
          (SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING + EDITOR_MARGIN) +
          scrollX;

        const y = clientY - EDITOR_MARGIN + scrollY;

        const isoCell = new XYCoord(x / zoom, y / zoom).toIsoCell();
        const iso = [isoCell.r, isoCell.c] as [number, number];

        const filteredInteractionCells = interactiveCells.filter(
          (icell) => icell.cell[0] !== iso[0] || icell.cell[1] !== iso[1]
        );

        if (filteredInteractionCells.length === interactiveCells.length) {
          interactiveCells.push({ cell: iso, interaction: "" });
        } else {
          textures[fillMode].interactiveCells = filteredInteractionCells;
        }

        updateSpecs({ textures: [...textures] });
      }}
      onDoubleClick={(ev) => {
        if (fillMode === -1) return;
        const { textures } = specs;
        const { renderCells } = textures[fillMode];
        const { clientX, clientY } = ev;

        const x =
          clientX +
          scrollX -
          (SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING + EDITOR_MARGIN);

        const y = clientY + scrollY - EDITOR_MARGIN;

        const isoCell = new XYCoord(x / zoom, y / zoom).toIsoCell();
        const iso = [isoCell.r, isoCell.c] as [number, number];

        const filteredCells = renderCells.filter(
          (cell) => cell[0] !== iso[0] || cell[1] !== iso[1]
        );

        if (filteredCells.length === renderCells.length) {
          renderCells.push(iso);
        } else {
          textures[fillMode].renderCells = filteredCells;
        }

        updateSpecs({ textures: [...textures] });
      }}
      onClick={(ev) => {
        if (fillMode === -1) return;
        const { textures } = specs;
        const { filledCells, interactiveCells, renderCells } =
          textures[fillMode];
        const { clientX, clientY } = ev;

        const x =
          clientX +
          scrollX -
          (SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING + EDITOR_MARGIN);

        const y = clientY + scrollY - EDITOR_MARGIN;

        const isoCell = new XYCoord(x / zoom, y / zoom).toIsoCell();
        const iso = [isoCell.r, isoCell.c] as [number, number];

        const filteredCells = filledCells.filter(
          (cell) => cell[0] !== iso[0] || cell[1] !== iso[1]
        );

        if (filteredCells.length === filledCells.length) {
          filledCells.push(iso);
        } else {
          textures[fillMode].filledCells = filteredCells;
        }

        updateSpecs({ textures: [...textures] });
      }}
    />
  );
};

const Texture = (props: {
  specs: Specs;
  updateSpecs: (newSpec: NewSpec) => void;
  index: number;
  fillMode: number;
  setFillMode: Dispatch<SetStateAction<number>>;
  zoom: number;
}) => {
  const [startDrag, updateStartDrag] = useState<[number, number]>([0, 0]);
  const [startOff, updateStartOff] = useState<[number, number]>([0, 0]);

  const { specs, updateSpecs, index, zoom } = props;
  const { textures } = specs;
  const texture = textures[index];
  const { src, pxOff, pyOff, filledCells } = texture;

  return src.length > 5 ? (
    <img
      draggable="false"
      id={`texture-${index}`}
      src={src}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        marginLeft:
          (SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING + EDITOR_MARGIN) / zoom +
          pxOff * PIXEL_MAG,
        marginTop: EDITOR_MARGIN / zoom + pyOff * PIXEL_MAG,
        zoom,
        cursor: props.fillMode === -1 ? "grab" : "default",
        opacity: props.fillMode === index ? 0.5 : 1,
        imageRendering: "pixelated",
      }}
      onMouseDown={(e) => {
        if (props.fillMode !== -1) return;
        updateStartDrag([e.clientX, e.clientY]);
        updateStartOff([pxOff, pyOff]);

        const textureElement = document.getElementById(`texture-${index}`);
        const editorSpace = document.getElementById("editor_space");
        if (!textureElement || !editorSpace) return;
        textureElement.style.cursor = "grabbing";
        editorSpace.onmousemove = (ev) => {
          if (ev.clientX === 0) return;

          const [startX, startY] = startDrag;
          const [pxOff, pyOff] = startOff;

          // console.log(ev.clientX - startX);

          texture.pxOff =
            Math.floor((ev.clientX - startX) / zoom / PIXEL_MAG) + pxOff;
          texture.pyOff =
            Math.floor((ev.clientY - startY) / zoom / PIXEL_MAG) + pyOff;

          updateSpecs({ textures });
        };
      }}
      onMouseUp={() => {
        if (props.fillMode !== -1) return;
        const textureElement = document.getElementById(`texture-${index}`);
        const editorSpace = document.getElementById("editor_space");
        if (!textureElement || !editorSpace) return;
        editorSpace.onmousemove = (ev) => {};
        textureElement.style.cursor = "grab";
      }}
      onMouseMove={(e) => {
        if (props.fillMode !== -1) return;
        updateStartDrag([e.clientX, e.clientY]);
        updateStartOff([pxOff, pyOff]);
      }}
    />
  ) : (
    <></>
  );
};

const Map = (props: { specs: Specs; zoom: number }) => {
  const { specs, zoom } = props;
  return specs.mapSrc.length > 5 ? (
    <img
      draggable="false"
      id="map"
      src={specs.mapSrc}
      style={{
        margin: EDITOR_MARGIN / zoom,
        marginLeft:
          (EDITOR_MARGIN + SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING) / zoom,
        zoom,
        imageRendering: "pixelated",
      }}
    />
  ) : (
    <></>
  );
};

const SideBar = (props: {
  specs: Specs;
  updateSpecs: (newSpec: NewSpec) => void;
  fillMode: number;
  setFillMode: Dispatch<SetStateAction<number>>;
}) => {
  const { specs, updateSpecs } = props;

  const getTexturesInputs = () => {
    const { textures } = specs;
    const elements = [];

    for (let i = 0; i < textures.length; i++) {
      elements.push(
        <div style={{ ...styles.label, marginTop: 20 }}>Texture</div>
      );
      elements.push(
        <input
          style={{ ...styles.input, marginTop: 20 }}
          onChange={(ev) => {
            const newTextures = textures;
            newTextures[i].src = `/${ev.target.value}.png`;
            updateSpecs({ textures: newTextures });
          }}
          value={textures[i].src.substring(1, textures[i].src.length - 4)}
        />
      );
      elements.push(<div style={styles.label}>Px Offset</div>);
      elements.push(
        <input
          type="number"
          style={styles.input}
          onChange={(ev) => {
            const newTextures = textures;
            newTextures[i].pxOff = parseInt(ev.target.value);
            updateSpecs({ textures: newTextures });
          }}
          onMouseEnter={() => {
            document.getElementsByTagName("body")[0].style.overflow = "hidden";
          }}
          onMouseLeave={() => {
            document.getElementsByTagName("body")[0].style.overflow = "auto";
          }}
          value={textures[i].pxOff}
        />
      );
      elements.push(<div style={styles.label}>Py Offset</div>);
      elements.push(
        <input
          type="number"
          style={styles.input}
          onChange={(ev) => {
            const newTextures = textures;
            newTextures[i].pyOff = parseInt(ev.target.value);
            updateSpecs({ textures: newTextures });
          }}
          onMouseEnter={() => {
            document.getElementsByTagName("body")[0].style.overflow = "hidden";
          }}
          onMouseLeave={() => {
            document.getElementsByTagName("body")[0].style.overflow = "auto";
          }}
          value={textures[i].pyOff}
        />
      );

      for (let j = 0; j < textures[i].interactiveCells.length; j++) {
        const icell = textures[i].interactiveCells[j];
        elements.push(
          <button
            style={styles.input}
            onClick={() => {
              const cell = document.getElementById(`${icell.interaction}-${j}`);
              if (!cell) return;
              const { display } = cell.style;
              cell.style.display = display === "none" ? "block" : "none";
            }}
          >{`ICell ${j + 1}`}</button>
        );
        elements.push(
          <input
            style={styles.input}
            onChange={(ev) => {
              icell.interaction = ev.target.value;
              updateSpecs({ textures });
            }}
            value={icell.interaction}
          />
        );
      }

      elements.push(
        <button
          style={styles.input}
          onClick={() => props.setFillMode(i === props.fillMode ? -1 : i)}
        >
          {props.fillMode === i ? "Fill Mode" : "Move Mode"}
        </button>
      );
      elements.push(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <button
            style={styles.input}
            onClick={() => {
              if (i === textures.length - 1) return;
              const newTextures = [...textures];

              const temp = newTextures[i];
              newTextures[i] = newTextures[i + 1];
              newTextures[i + 1] = temp;
              if (props.fillMode === i) props.setFillMode(i + 1);
              else if (props.fillMode === i + 1) props.setFillMode(i);

              updateSpecs({ textures: newTextures });
            }}
          >
            Forward
          </button>
          <button
            style={styles.input}
            onClick={() => {
              if (i === 0) return;
              const newTextures = [...textures];

              const temp = newTextures[i];
              newTextures[i] = newTextures[i - 1];
              newTextures[i - 1] = temp;
              if (props.fillMode === i) props.setFillMode(i - 1);
              else if (props.fillMode === i - 1) props.setFillMode(i);

              updateSpecs({ textures: newTextures });
            }}
          >
            Back
          </button>
          <button
            style={styles.input}
            onClick={() => {
              if (props.fillMode === i) props.setFillMode(-1);
              const newTextures = textures.filter((t) => t !== textures[i]);
              updateSpecs({ textures: newTextures });
            }}
          >
            Delete
          </button>
        </div>
      );
    }

    return elements;
  };

  return (
    <div style={styles.sidebar}>
      <h1 style={{ textAlign: "center" }}>Map Maker</h1>
      <div style={styles.sidebarGrid}>
        <div style={styles.label}>Load</div>
        <input
          id="load"
          style={styles.input}
          onKeyDown={(ev) => {
            if (ev.key !== "Enter") return;
            const newLoad = document.getElementById("load") as HTMLInputElement;
            const loadVal = newLoad.value;
            if (!loadVal) return;
            try {
              const loadObj = JSON.parse(loadVal);
              if (
                specs.textures.length > 0 &&
                !confirm("Are you sure you want to load?")
              )
                return;
              updateSpecs(loadObj);
              newLoad.value = "";
            } catch (e) {}
          }}
        />
        <div style={{ ...styles.label, marginTop: 20 }}>Map Name</div>
        <input
          style={{ ...styles.input, marginTop: 20 }}
          onChange={(ev) => updateSpecs({ mapName: ev.target.value })}
          value={specs.mapName}
        />
        <div style={styles.label}>Filename</div>
        <input
          style={styles.input}
          onChange={(ev) => updateSpecs({ mapSrc: `/${ev.target.value}.png` })}
          value={specs.mapSrc.substring(1, specs.mapSrc.length - 4)}
        />
        <button
          style={{ ...styles.input, marginBottom: 20 }}
          onClick={() => {
            const newTextures = specs.textures;
            newTextures.push({
              src: "",
              pxOff: 0,
              pyOff: 0,
              filledCells: [],
              interactiveCells: [],
              renderCells: [],
            });
            updateSpecs({ textures: newTextures });
          }}
        >
          Add Texture
        </button>
        <button
          style={{ ...styles.input, marginBottom: 20 }}
          onClick={() => {
            props.setFillMode(-1);
            updateSpecs({ textures: [] });
          }}
        >
          Delete Textures
        </button>
        {getTexturesInputs()}
      </div>
      <br />
      <br />
      <br />
      <button
        id="copy_button"
        style={styles.input}
        onClick={(ev) => {
          navigator.clipboard.writeText(JSON.stringify(specs, null, 1));
          const button = document.getElementById("copy_button");
          if (!button) return;
          button.innerHTML = "Copied!";
          setTimeout(() => (button.innerHTML = "Copy"), 1000);
        }}
      >
        Copy
      </button>
      <br />
      <br />
      {JSON.stringify(specs, null, 1)}
    </div>
  );
};

const styles: StyleSet = {
  main: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "blue",
    minHeight: "100vh",
    height: "",
    alignItems: "stretch",
    fontFamily: "Courier New",
    fontWeight: "bolder",
  },

  editorSpace: {
    backgroundColor: DARKER_GRAY,
    flexGrow: 1,
    height: "100%",
    minHeight: "100vh",
    // overflow: "auto",
  },

  sidebar: {
    backgroundColor: DARK_GRAY,
    flexGrow: 0,
    flexShrink: 0,
    width: SIDEBAR_WIDTH,
    paddingLeft: SIDEBAR_PADDING,
    paddingRight: SIDEBAR_PADDING,
    color: LIGHT_GRAY,
    position: "fixed",
    height: "100vh",
    left: 0,
    top: 0,
    zIndex: 5,
    overflow: "auto",
  },

  sidebarGrid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: 10,
  },

  label: {
    textAlign: "right",
  },

  input: {
    backgroundColor: LIGHT_GRAY,
    outline: "none",
    border: "0px",
    borderRadius: 3,
    padding: "3px 5px 3px 5px",
    color: DARKER_GRAY,
    fontFamily: "Courier New",
    fontWeight: "bolder",
  },

  selector: {
    display: "none",
    margin: EDITOR_MARGIN,
    position: "absolute",
    top: 0,
    left: SIDEBAR_WIDTH + 2 * SIDEBAR_PADDING,
    zIndex: 4,
    cursor: "pointer",
  },
};

export default MapMaker;
