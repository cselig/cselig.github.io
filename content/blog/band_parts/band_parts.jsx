import React, {useState} from "react";

const k = {
  svg_height: 400,
  svg_width: 700,
  grid_cell_size: 15,
  colors: ['red', 'blue', 'green', 'purple', 'none'],
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

const SectionLabels = ({sections, shortenSection, lengthenSection, addSection}) => {
  const lines = [];
  const labels = [];
  let i = 0;
  for (const {section, length} of sections) {
    i += length;
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
        fill="black" style={{textAnchor: 'middle', dominantBaseline: 'middle'}}
        key={section}
      >{section}</text>
    );
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
  const addSectionButton = <text
      onClick={addSection}
      x={(i + 0.5) * k.grid_cell_size} y={-2 * k.grid_cell_size}
      style={{textAnchor: 'start', dominantBaseline: 'middle', cursor: 'pointer'}}
    >+ Section</text>
  return <g className="sections">
    <g>{lines}</g>
    <g>{labels}</g>
    {addSectionButton}
  </g>;
}

const InstrumentLabels = ({instruments, addInstrument}) => {
  const lines = [];
  const labels = [];
  for (let i = 0; i < instruments.length; i++) {
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
        fill="black" style={{textAnchor: 'middle', dominantBaseline: 'middle'}}
        key={instruments[i].instrument}
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
    {addInstrumentButton}
  </g>;
}

const Sections = ({sections, instruments, onSectionClick, activeColor}) => {
  const rectangles = [];
  for (let i = 0; i < instruments.length; i++) {
    let x = 0;
    for (let j = 0; j < sections.length; j++) {
      const width = sections[j].length * k.grid_cell_size;
      const color = instruments[i].sections.hasOwnProperty(sections[j].section)
        ? instruments[i].sections[sections[j].section] : 'none';
      rectangles.push(
        <rect
          x={x} y={i * 4 * k.grid_cell_size}
          height={4 * k.grid_cell_size} width={width}
          fill={color} key={instruments[i].instrument + ':' + sections[j].section}
          onClick={() => onSectionClick(instruments[i].instrument, sections[j].section)}
          style={{pointerEvents: 'all', cursor: activeColor ? 'pointer' : 'auto'}}
        ></rect>
      );
      x += width;
    }
  }
  return <g>{rectangles}</g>;
}

const ColorPicker = ({activeColor, onColorClick}) => {
  const circles = [];
  for (let i = 0; i < k.colors.length; i++) {
    circles.push(
      <circle
        r={k.color_picker_circle_radius} style={{cursor: 'pointer'}}
        cx={(i + 1) * k.color_picker_circle_radius * 2.5}
        cy={k.color_picker_circle_radius * 1.5}
        fill={k.colors[i]} key={k.colors[i]} onClick={() => onColorClick(k.colors[i])}
        pointerEvents="all"
      ></circle>
    );
    circles.push(
      <circle
        r={k.color_picker_circle_radius} style={{cursor: 'pointer'}}
        cx={(i + 1) * k.color_picker_circle_radius * 2.5}
        cy={k.color_picker_circle_radius * 1.5}
        fill="none" stroke="black" strokeWidth={activeColor === k.colors[i] ? 5 : 1}
        key={k.colors[i] + "Ring"}
        onClick={() => onColorClick(k.colors[i])}
      ></circle>
    );
  }
  return <g>{circles}</g>;
}

const SongTitle = ({title, setTitle}) => {
  const editTitle = () => {
    const title = window.prompt("Enter song title:");
    if (!title) return;
    setTitle(title);
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

const SaveLoadControls = ({instruments, sections, title, load}) => {
  const copy = () => {
    const data = {instruments: instruments, sections: sections, title: title};
    navigator.clipboard.writeText(JSON.stringify(data));
  }
  return <div>
    <button onClick={copy}>Copy data</button>
    <button onClick={load}>Load data from clipboard</button>
  </div>
}

const MOCK_INSTRUMENTS = [
  {
    instrument: 'Drums',
    sections: {},
  },
  {
    instrument: 'Bass',
    sections: {
      'intro': 'blue',
      'chorus': 'red',
    }
  },
  {
    instrument: 'Guitar 1',
    sections: {
      verse: 'green',
    },
  },
];

const MOCK_SECTIONS = [
  {section: 'intro', length: 4},
  {section: 'verse', length: 8},
  {section: 'chorus', length: 4},
];

function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const BandParts = () => {
  const [instruments, setInstruments] = useState([]);
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState('Click to edit title');
  const [activeColor, setActiveColor] = useState(null);

  const onSectionClick = (instrument, section) => {
    if (!activeColor) return;
    const newInstruments = deepcopy(instruments);
    for (const i of newInstruments) {
      if (i.instrument === instrument) {
        i.sections[section] = activeColor;
      }
    }
    setInstruments(newInstruments);
  }

  const onColorClick = (color) => {
    if (activeColor === color) {
      setActiveColor(null);
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

  const addSection = () => {
    const sectionName = window.prompt("Enter section name:");
    if (!sectionName) return;
    for (const s of sections) {
      if (s.section === sectionName) {
        window.alert("Section name already exists!");
        return;
      }
    }
    const newSections = deepcopy(sections);
    newSections.push({section: sectionName, length: 4});
    setSections(newSections);
  }

  const addIntrument = () => {
    const instrumentName = window.prompt("Enter instrument name:");
    if (!instrumentName) return;
    for (const i of instruments) {
      if (i.instrument === instrumentName) {
        window.alert("Instrument name already exists!");
        return;
      }
    }
    const newInstruments = deepcopy(instruments);
    newInstruments.push({instrument: instrumentName, sections: {}});
    setInstruments(newInstruments);
  }

  const load = async () => {
    const text = await navigator.clipboard.readText();
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Couldn't parse JSON");
      return;
    }
    setInstruments(data.instruments);
    setSections(data.sections);
    setTitle(data.title);
  }

  return (
    <div>
      <svg height={65} width={300}>
        <ColorPicker activeColor={activeColor} onColorClick={onColorClick} />
      </svg>
      <svg height={k.svg_height} width={k.svg_width}
        style={{border: '1px solid lightgrey'}}
      >
        <GridLines/>
        <g style={{transform: `translate(${k.x_transform}px, ${k.y_transform}px)`}}>
          <Sections
            sections={sections}
            instruments={instruments}
            onSectionClick={onSectionClick}
            activeColor={activeColor}
          />
          <SectionLabels
            sections={sections}
            shortenSection={shortenSection}
            lengthenSection={lengthenSection}
            addSection={addSection} />
          <InstrumentLabels
            instruments={instruments}
            addInstrument={addIntrument} />
        </g>
        <Axes/>
        <SongTitle title={title} setTitle={setTitle} />
      </svg>
      <SaveLoadControls
        instruments={instruments}
        sections={sections}
        title={title}
        load={load} />
    </div>
  );
}

export default BandParts
