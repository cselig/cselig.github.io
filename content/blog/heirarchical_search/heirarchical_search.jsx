import React, { useState } from 'react';

import "./styles.scss";

const COLOR_PALLETES = [
  ["#3949AB", "#5C6BC0", "#9FA8DA"],
  ["#43A047", "#66BB6A", "#A5D6A7"],
]

const LOCATIONS = [
  {
    value: 'US',
    children: [
      {
        value: 'California',
        children: [
          {value: 'San Francisco'}, {value: 'Los Angeles'}, {value: 'San Diego'},
        ]
      },
      {
        value: 'Remote'
      },
    ]
  },
  {
    value: 'Europe',
    children: [
      {
        value: 'UK',
        children: [{value: 'London'}]
      },
      {
        value: 'Germany',
        children: [{value: 'Berlin'}, {value: 'Hamburg'}, {value: 'Remote'}]
      }
    ]
  },
  {
    value: 'Asia',
    children: [
      {
        value: 'Japan',
        children: [{value: 'Tokyo'}, {value: 'Osaka'}]
      },
      {
        value: 'Korea',
        children: [{value: 'Seoul'}]
      },
      {value: 'Singapore'},
    ]
  }
]

const JOB_CATEGORIES = [
  {
    value: 'Software Engineering',
    children: [
      {value: 'Backend'},
      {value: 'Frontend'},
      {value: 'Infra'},
      {value: 'SRE'},
    ]
  },
  {
    value: 'User Experience',
    children: [{value: 'Eng'}, {value: 'Design'}, {value: 'Research'}],
  },
  {
    value: 'Marketing',
    children: [{value: 'SEO Specialist'}, {value: 'Copywriter'}, {value: 'Social Media'}]
  }
]

function Chip({value, index, remove, color}) {
  return (
    <div className="chip" style={{zIndex: 10 - index, backgroundColor: color}}>
      <p>{value}{' '}
        <span className="remove" onClick={() => remove(value)}>x</span>
      </p>
    </div>
  )
}

function Options({options, select}) {
  const optionsHtml = options.map((node) => {
    return <p key={node.value} onClick={() => select(node)}>{node.value}</p>
  })
  return (
    <div className="options">
      {optionsHtml}
    </div>
  )
}

function Chips({vals, colors}) {
  const [path, setPath] = useState([])
  const [options, setOptions] = useState(vals)

  const select = (node) => {
    const newPath = path.concat([node.value])
    setPath(newPath)
    setOptions(node.children)
  }

  const remove = (value) => {
    const newPath = path.splice(0, path.indexOf(value))
    setPath(newPath)

    let current = vals
    for (const val of newPath) {
      current = current.filter(node => node.value === val)[0].children
    }
    setOptions(current)
  }

  const chips = path.map((value, i) => {
    return <Chip key={value} value={value} remove={remove} index={i} color={colors[i]} />
  })
  return (
    <div className="filter">
      <div className="chips">
        {chips}
      </div>
      <Options options={options || []} select={select} />
    </div>
  );
}

function Component() {
  return (
    <div id="categories">
      <div className="filters">
        <h3>Location</h3>
        <Chips vals={LOCATIONS} colors={COLOR_PALLETES[0]} />
        <h3>Job Type</h3>
        <Chips vals={JOB_CATEGORIES} colors={COLOR_PALLETES[1]} />
      </div>
    </div>
  );
}

export default Component;
