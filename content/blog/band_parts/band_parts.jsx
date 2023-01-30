import React, {useState, useEffect} from "react";

import boogiemanSam from './data/boogieman_sam.json';
import ridealong from './data/ridealong.json';

const DATA_MAP = {
  'boogieman_sam': boogiemanSam,
  'ridealong': ridealong,
}

const DEFAULT_SONG_TITLE = 'Click to edit title';

const k = {
  svg_height: 400,
  svg_width: 700,
  grid_cell_size: 15,
  colors: [
    // https://m1.material.io/style/color.html#color-color-palette
    // 800, 400, 100
    ['#283593', '#5C6BC0', '#C5CAE9'], // blue
    ['#C62828', '#EF5350', '#FFCDD2'], // red
    ['#2E7D32', '#66BB6A','#C8E6C9'], // green
  ],
  color_picker_circle_radius: 20,
};
k.x_transform = k.grid_cell_size * 7;
k.y_transform = k.grid_cell_size * 4

const Axes = () => {
  return (
    <g className="axes">
      <line
        x1={k.x_transform} y1={0}
        x2={k.x_transform} y2={k.svg_height}
        stroke="black" strokeWidth="3px"
      ></line>
      <line
        x1={0} y1={k.y_transform}
        x2={k.svg_width} y2={k.y_transform}
        stroke="black" strokeWidth="3px"
      >
      </line>
  </g>
  );
}

const GridLines = () => {
  let lines = [];
  // vertical
  for (let i = 0; i < k.svg_width; i += k.grid_cell_size) {
    lines.push(
      <line
        x1={i} x2={i}
        y1={0} y2={k.svg_height}
        key={`vertical${i}`}
        stroke="#F5F5F5" strokeWidth="1px"
      ></line>
    )
  }
  // horizontal
  for (let i = 0; i < k.svg_height; i += k.grid_cell_size) {
    lines.push(
      <line
        x1={0} x2={k.svg_width}
        y1={i} y2={i}
        key={`horizontal${i}`}
        stroke="#F5F5F5" strokeWidth="1px"
      ></line>
    )
  }
  return <g className="grid-lines">{lines}</g>;
}

const Cells = ({cells, setCells, sections, instruments, mouseClicked, setMouseClicked, activeColor, interactable}) => {
  let maxX = sections.reduce((total, section) => total + section.length, 0) * k.grid_cell_size;
  let maxY = instruments.length * 4 * k.grid_cell_size;
  let cellSvgs = [];
  for (const [cellId, color] of Object.entries(cells)) {
    const [i, j] = cellId.split(':');
    const [x, y] = [j * k.grid_cell_size, i * k.grid_cell_size];
    const [gridX, gridY] = [x - k.x_transform, y - k.y_transform];
    const isPaintable = maxX > 0 && maxY > 0 && gridX >= 0 && gridY >= 0 && gridX < maxX && gridY < maxY;

    const colorCell = () => {
      const newCells = deepcopy(cells);
      newCells[cellId] = activeColor || 'none';
      setCells(newCells);
    }
    const mouseOver = () => {
      if (isPaintable && mouseClicked && interactable) {
        colorCell(cellId);
      }
    }
    const mouseDown = () => {
      if (!isPaintable || !interactable) return;
      colorCell();
      setMouseClicked(true);
    }
    const mouseUp = () => {
      if (interactable) setMouseClicked(false);
    }
    cellSvgs.push(
      <rect
        className="cell" key={cellId}
        onMouseOver={mouseOver} onMouseDown={mouseDown} onMouseUp={mouseUp}
        onClick={() => console.log("click", i, j)}
        x={x} y={y}
        fill={color}
        height={k.grid_cell_size} width={k.grid_cell_size}
        style={{pointerEvents: 'all', cursor: isPaintable ? 'pointer' : 'auto'}}
      ></rect>
    )
  }
  return cellSvgs;
}

const SectionLabels = ({sections, shortenSection, lengthenSection, addSection, interactable, changeSectionName}) => {
  const lines = [];
  const labels = [];
  let i = 0;
  for (const {section, length} of sections) {
    i += length;
    const editSection = () => {
      if (!interactable) return;
      const newName = window.prompt("Edit section name:", section);
      if (!newName) return;
      changeSectionName(section, newName);
    }
    lines.push(
      <line
        x1={i * k.grid_cell_size} x2={i * k.grid_cell_size}
        y1={-1 * k.y_transform} y2={k.svg_height}
        key={section}
        stroke="black" strokeWidth="1px"
      ></line>
    );
    labels.push(
      <text
        x={(i - length / 2) * k.grid_cell_size} y={-1 * k.grid_cell_size}
        fill="black" style={{textAnchor: 'middle', dominantBaseline: 'middle', cursor: 'pointer'}}
        key={section} onClick={editSection}
      >{section}</text>
    );
    if (interactable) {
      // Shorten button
      labels.push(
        <text
          x={(i - length / 2) * k.grid_cell_size - 10} y={-2.5 * k.grid_cell_size}
          fill="black" key={section + "Shorten"} onClick={() => shortenSection(section)}
          style={{textAnchor: 'middle', dominantBaseline: 'middle', cursor: 'pointer'}}
        >-</text>
      );
      // Lengthen button
      labels.push(
        <text
          x={(i - length / 2) * k.grid_cell_size + 10} y={-2.5 * k.grid_cell_size}
          fill="black" key={section + "Lengthen"} onClick={() => lengthenSection(section)}
          style={{textAnchor: 'middle', dominantBaseline: 'middle', cursor: 'pointer'}}
        >+</text>
      );
    }
  }
  const addSectionButton = <text
      onClick={addSection}
      x={(i + 0.5) * k.grid_cell_size} y={-2 * k.grid_cell_size}
      style={{textAnchor: 'start', dominantBaseline: 'middle', cursor: 'pointer'}}
    >+ Section</text>
  return <g className="sections">
    <g>{lines}</g>
    <g>{labels}</g>
    {interactable && addSectionButton}
  </g>;
}

const InstrumentLabels = ({instruments, addInstrument, interactable, changeInstrumentName}) => {
  const lines = [];
  const labels = [];
  for (let i = 0; i < instruments.length; i++) {
    const editInstrument = () => {
      if (!interactable) return;
      const newName = window.prompt("Edit instrument name:", instruments[i].instrument);
      if (!newName) return;
      changeInstrumentName(instruments[i].instrument, newName);
    }
    lines.push(
      <line
        x1={-1 * k.x_transform} x2={k.svg_width - k.x_transform}
        y1={(i + 1) * 4 * k.grid_cell_size} y2={(i + 1) * 4 * k.grid_cell_size}
        stroke="black" strokeWidth="1px"
        key={instruments[i].instrument}
      ></line>
    );
    labels.push(
      <text
        x={-1 * k.x_transform / 2} y={(i * 4 + 2) * k.grid_cell_size}
        fill="black" style={{textAnchor: 'middle', dominantBaseline: 'middle', cursor: 'pointer'}}
        key={instruments[i].instrument}
        onClick={editInstrument}
      >{instruments[i].instrument}</text>
    )
  }
  const addInstrumentButton = <text
    x={-1 * k.x_transform / 2} y={(instruments.length * 4 + 2) * k.grid_cell_size}
    onClick={addInstrument}
    fill="black" style={{textAnchor: 'middle', dominantBaseline: 'middle', cursor: 'pointer'}}
  >+ Instrument</text>;
  return <g className="instruments">
    <g>{lines}</g>
    <g>{labels}</g>
    {interactable && addInstrumentButton}
  </g>;
}

const ColorPicker = ({activeColor, onColorClick}) => {
  const circles = [];
  for (let i = 0; i < k.colors.length; i++) {
    for (let j = 0; j < k.colors[i].length; j++) {
      const cx = (j + 1) * k.color_picker_circle_radius * 1.5;
      const cy = (i + 1) * k.color_picker_circle_radius * 1.5;
      circles.push(
        <circle
          r={k.color_picker_circle_radius} style={{cursor: 'pointer'}}
          cx={cx} cy={cy}
          fill={k.colors[i][j]} key={k.colors[i][j]} onClick={() => onColorClick(k.colors[i][j])}
          pointerEvents="all"
        ></circle>
      );
      circles.push(
        <circle
          r={k.color_picker_circle_radius} style={{cursor: 'pointer'}}
          cx={cx} cy={cy}
          fill="none" stroke="black"
          strokeWidth={activeColor === k.colors[i][j] ? 5 : 1}
          key={k.colors[i][j] + "Ring"}
          onClick={() => onColorClick(k.colors[i][j])}
        ></circle>
      );
    }
  }
  return <g>{circles}</g>;
}

const SongTitle = ({title, setTitle, interactable}) => {
  const editTitle = () => {
    if (!interactable) return;
    let newTitle;
    if (title === DEFAULT_SONG_TITLE) {
      newTitle = window.prompt("Enter song title:");
    } else {
      newTitle = window.prompt("Edit song title:", title);
    }
    if (!newTitle) return;
    setTitle(newTitle);
  }

  return <text
    onClick={editTitle}
    x={k.x_transform / 2}
    y={k.y_transform / 2}
    style={{
      textAnchor: 'middle',
      dominantBaseline: 'middle',
      cursor: 'pointer',
      fontSize: '12',
    }}
  >{title}</text>;
}

const SaveLoadControls = ({copy, load}) => {
  const loadFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Couldn't parse JSON");
      return;
    }
    load(data);
  }
  return <div>
    <button onClick={copy}>Copy data</button>
    <button onClick={loadFromClipboard}>Load data from clipboard</button>
  </div>
}

function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function createCells() {
  let cells = {};
  for (let i = 0; i * k.grid_cell_size < k.svg_height; i++) {
    for (let j = 0; j * k.grid_cell_size < k.svg_width; j++) {
      const cellId = `${i}:${j}`;
      cells[cellId] = 'none';
    }
  }
  return cells;
}

const BandParts = ({dataFile}) => {
  const [instruments, setInstruments] = useState([]);
  // [{length: int, section: string}]
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState(DEFAULT_SONG_TITLE);
  const [activeColor, setActiveColor] = useState(null);
  // { cellId: {}}, cellId: {i, j}
  const [cells, setCells] = useState(createCells);
  const [mouseClicked, setMouseClicked] = useState(false);
  const [interactable, setInteractable] = useState(true);

  const copy = () => {
    const data = {title: title, sections: sections, instruments: instruments, cells: cells};
    navigator.clipboard.writeText(JSON.stringify(data));
  }

  const load = (data) => {
    setInstruments(data.instruments);
    setSections(data.sections);
    setCells(data.cells);
    setTitle(data.title);
  }

  useEffect(() => {
    if (dataFile) {
      if (!DATA_MAP.hasOwnProperty(dataFile)) {
        console.error(`Data file not found: ${dataFile}`);
        return;
      }
      load(DATA_MAP[dataFile]);
      setInteractable(false);
    }
  }, []);

  const onColorClick = (color) => {
    if (activeColor === color) {
      setActiveColor('none');
    } else {
      setActiveColor(color);
    }
  }

  const modifySectionLength = (section, diff) => {
    const newSections = [];
    for (const s of sections) {
      const newS = deepcopy(s);
      if (newS.section === section) {
        newS.length += diff;
      }
      if (newS.length > 0) {
        newSections.push(newS)
      }
    }
    setSections(newSections);
  }

  const shortenSection = (section) => {
    modifySectionLength(section, -1);
  }

  const lengthenSection = (section) => {
    modifySectionLength(section, 1);
  }

  const sectionNameExists = (name) => {
    for (const s of sections) {
      if (s.section === name) {
        return true;
      }
    }
    return false;
  }

  const addSection = () => {
    const sectionName = window.prompt("Enter section name:");
    if (!sectionName) return;
    if (sectionNameExists(sectionName)) {
      window.alert("Section name already exists!");
      return;
    }
    const newSections = deepcopy(sections);
    newSections.push({section: sectionName, length: 4});
    setSections(newSections);
  }

  const changeSectionName = (oldName, newName) => {
    if (oldName === newName) return;
    if (sectionNameExists(newName)) {
      window.alert("Section name already exists!");
      return;
    }
    const newSections = deepcopy(sections);
    for (let i = 0; i < newSections.length; i++) {
      if (newSections[i].section === oldName) {
        newSections[i].section = newName;
      }
    }
    setSections(newSections);
  }

  const instrumentNameExists = (name) => {
    for (const i of instruments) {
      if (i.instrument === name) {
        return true;
      }
    }
    return false;
  }

  const addInstrument = () => {
    const instrumentName = window.prompt("Enter instrument name:");
    if (!instrumentName) return;
    if (instrumentNameExists(instrumentName)) {
      window.alert("Instrument name already exists!");
      return;
    }
    const newInstruments = deepcopy(instruments);
    newInstruments.push({instrument: instrumentName, sections: {}});
    setInstruments(newInstruments);
  }

  const changeInstrumentName = (oldName, newName) => {
    if (oldName === newName) return;
    if (instrumentNameExists(newName)) {
      window.alert("Instrument name already exists!");
      return;
    }
    const newInstruments = deepcopy(instruments);
    for (let i = 0; i < newInstruments.length; i++) {
      if (newInstruments[i].instrument === oldName) {
        newInstruments[i].instrument = newName;
      }
    }
    setInstruments(newInstruments);
  }

  return (
    <div>
      <svg height={k.svg_height} width={k.svg_width}
        style={{border: '1px solid lightgrey'}}
      >
        <Cells
          cells={cells}
          setCells={setCells}
          sections={sections}
          instruments={instruments}
          mouseClicked={mouseClicked}
          setMouseClicked={setMouseClicked}
          activeColor={activeColor}
          interactable={interactable} />
        <GridLines/>
        <g style={{transform: `translate(${k.x_transform}px, ${k.y_transform}px)`}}>
          <SectionLabels
            sections={sections}
            shortenSection={shortenSection}
            lengthenSection={lengthenSection}
            addSection={addSection}
            interactable={interactable}
            changeSectionName={changeSectionName} />
          <InstrumentLabels
            instruments={instruments}
            addInstrument={addInstrument}
            interactable={interactable}
            changeInstrumentName={changeInstrumentName} />
        </g>
        <Axes/>
        <SongTitle title={title} setTitle={setTitle} interactable={interactable} />
      </svg>
      {interactable &&
        <>
          <svg height={150} width={300}>
            <ColorPicker activeColor={activeColor} onColorClick={onColorClick} />
          </svg>
          <SaveLoadControls
            instruments={instruments}
            sections={sections}
            title={title}
            copy={copy}
            load={load} />
        </>
      }
    </div>
  );
}

export default BandParts
