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
        value: 'Washington',
        children: [{value: 'Seattle'}],
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
    children: [{value: 'SEO'}, {value: 'Copywriting'}, {value: 'Social Media'}]
  }
]

const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed ligula elit, dapibus a justo sed, finibus ornare metus.
Class aptent taciti sociosqu ad litora torquent per conubia
nostra, per inceptos himenaeos. Nunc consequat aliquam pulvinar.
Quisque eu ex mi. Sed suscipit nisi ac imperdiet scelerisque.
Sed facilisis mauris purus, ultrices dignissim ex facilisis quis.
Aenean vel lectus nunc`.split(".");

const generateIpsum = () => {
  const cutPoint = 0.5 + Math.random() / 2;
  const sentances = Math.ceil(cutPoint * LOREM_IPSUM.length);
  return LOREM_IPSUM.slice(0, sentances).join(". ") + ".";
}

const JOBS = [
  {
    title: 'Senior Software Engineer',
    location: ['US', 'Remote'],
    category: ['Software Engineering', 'Backend'],
  },
  {
    title: 'UX Engineer, Payments',
    location: ['Europe', 'Germany', 'Berlin'],
    category: ['User Experience', 'Eng'],
  },
  {
    title: 'Lead Copywriter',
    location: ['US', 'California', 'San Diego'],
    category: ['Marketing', 'Copywriting']
  },
  {
    title: 'UX Research Program Manager',
    location: ['US', 'Washington', 'Seattle'],
    category: ['User Experience', 'Research'],
  },
  {
    title: 'UX Researcher (new grad)',
    location: ['US', 'Washington', 'Seattle'],
    category: ['User Experience', 'Research'],
  },
  {
    title: 'UX Researcher II',
    location: ['US', 'Washington', 'Seattle'],
    category: ['User Experience', 'Research'],
  },
  {
    title: 'Software Engineer II, Frontend',
    location: ['US', 'California', 'San Francisco'],
    category: ['Software Engineering', 'Frontend'],
  },
  {
    title: 'Infrastructure Software Engineer',
    location: ['US', 'California', 'San Francisco'],
    category: ['Software Engineering', 'Infra'],
  },
  {
    title: 'Site Reliability Engineer',
    location: ['Europe', 'Germany', 'Hamburg'],
    category: ['Software Engineering', 'SRE'],
  },
  {
    title: 'Senior Site Reliability Engineer',
    location: ['Europe', 'Germany', 'Hamburg'],
    category: ['Software Engineering', 'SRE'],
  },
  {
    title: 'Social Media Manager',
    location: ['Europe', 'UK', 'London'],
    category: ['Marketing', 'Social Media'],
  },
]

for (let job of JOBS) {
  job.description = generateIpsum();
}

function Chip({value, index, remove, color}) {
  return (
    <div className="chip" style={{zIndex: 10 - index, backgroundColor: color}}>
      <p>{value}{' '}
        {remove && <span className="remove" onClick={() => remove(value)}>x</span>}
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

function Chips({path, setPath, vals, colors}) {
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
    <div className="filter-chip">
      <div className="chips">
        {chips}
      </div>
      <Options options={options || []} select={select} />
    </div>
  );
}

function ValueChips({path, colors}) {
  const chips = path.map((value, i) => {
    return <Chip key={value} value={value} index={i} color={colors[i]} />
  });
  return (
    <div className="value-chip">
      <div className="chips">
        {chips}
      </div>
    </div>
  );
}

const objEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

function JobList({locationFilter, categoryFilter}) {
  const jobId = (job) => job.title + JSON.stringify(job.location) + JSON.stringify(job.category);

  const jobHtml = (job) => (
    <div key={jobId(job)} className="job-card">
      <h3 className="title">{job.title}</h3>
      <p className="description">{job.description}</p>
      <div className="value-chips">
        <ValueChips path={job.location} colors={COLOR_PALLETES[0]} />
        <ValueChips path={job.category} colors={COLOR_PALLETES[1]} />
      </div>
    </div>
  );

  const filteredJobs = JOBS.filter(job => {
    return objEqual(locationFilter, job.location.slice(0, locationFilter.length)) &&
      objEqual(categoryFilter, job.category.slice(0, categoryFilter.length));
  }).map(job => jobHtml(job));

  if (filteredJobs.length === 0) {
    return <div className="job-list empty">
      <p>No jobs found! Please broaden your filters.</p>
    </div>
  }

  return <div className="job-list">{filteredJobs}</div>;
}

function Component() {
  const [location, setLocation] = useState([]);
  const [category, setCategory] = useState([]);

  return (
    <div id="categories">
      <div className="filters">
        <h3>Location</h3>
        <Chips path={location} setPath={setLocation}
          vals={LOCATIONS} colors={COLOR_PALLETES[0]} />
        <h3>Job Type</h3>
        <Chips path={category} setPath={setCategory}
          vals={JOB_CATEGORIES} colors={COLOR_PALLETES[1]} />
      </div>
      <JobList locationFilter={location} categoryFilter={category} />
    </div>
  );
}

export default Component;
