import React, { useState } from 'react';

import "./styles.scss";

const EMPTY_BEAT = ['-', '-', '-', '-'];
const BAR_LINE = ['|', '|', '|', '|'];

const INITIAL_DATA = [
  BAR_LINE,
  EMPTY_BEAT,
  ['2', '3', '2', '0'],
  EMPTY_BEAT,
  BAR_LINE,
]

const deepCopy = (data) => JSON.parse(JSON.stringify(data));

function RootComponent() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [selectedBeatEdit, setSelectedBeatEdit] = useState('');

  const addEmptyBeat = () => {
    const newData = deepCopy(data);
    newData.push(EMPTY_BEAT);
    setData(newData);
  }

  const addBarLine = () => {
    const newData = deepCopy(data);
    newData.push(BAR_LINE);
    setData(newData);
  }

  const removeLastBeat = () => {
    const newData = deepCopy(data);
    newData.pop();
    setData(newData);
  }

  const dataHtml = data.map((beat, beatInd) => {
    const select = () => {
      setSelectedBeat(beatInd);
      setSelectedBeatEdit(beat.join(' '));
    }
    const notes = beat.map((note, noteInd) => <span key={noteInd} className="note">{note}</span>)
    return <div className={"beat " + (selectedBeat === beatInd ? "selected" : "")}
              key={beatInd}
              onClick={select}>{notes}</div>
  });

  const updateBeat = () => {
    const newBeat = selectedBeatEdit.split(' ');
    if (newBeat.length !== 4) {
      window.alert("Beat must specify all 4 strings.");
      return;
    }
    console.log(newBeat);
    const newData = deepCopy(data);
    newData[selectedBeat] = newBeat;
    setData(newData);
  }

  return (
    <div id="uketabs">
      <div className="controls">
        <div className="row">
          <button onClick={addEmptyBeat}>Add empty beat</button>
          <button onClick={addBarLine}>Add bar line</button>
          <button onClick={removeLastBeat}>Remove last beat</button>
        </div>
        <input name="edit-bar" value={selectedBeatEdit}
          onChange={e => setSelectedBeatEdit(e.target.value)}></input>
        <button onClick={updateBeat}>Update selected beat</button>
      </div>
      <pre className="display">{dataHtml}</pre>
    </div>
  );
}

export default RootComponent
