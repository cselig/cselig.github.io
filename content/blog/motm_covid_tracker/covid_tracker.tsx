import React, {useState} from "react";

import './styles.scss'

enum People {
  ALISON,
  BRAD,
  CHARLIE,
  CHRISTIAN,
  DANNVER,
  DEREK,
  DREW,
  HANYU,
  JOE,
  JONATHAN,
  KAREN,
  SETH,
  ZHIMIN,
};

enum Locations {
  SODA_SPRINGS_CABIN,
  DONNER_PASS_CABIN,
  PALISADES,
  TRUCKEE,
  HOTEL,
  BAY_AREA,
};

enum CovidStatus {
  HEALTHY,
  INFECTED,
  TESTED_POSITIVE,
}

const INITIAL_PEOPLE_STATE = {
  [People.ALISON]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.BRAD]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.CHARLIE]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.CHRISTIAN]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.DANNVER]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.DEREK]: {
    covidStatus: CovidStatus.INFECTED,
    location: Locations.BAY_AREA,
  },
  [People.DREW]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.HANYU]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.JOE]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.JONATHAN]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.KAREN]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.SETH]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
  [People.ZHIMIN]: {
    covidStatus: CovidStatus.HEALTHY,
    location: Locations.BAY_AREA,
  },
};

enum EventType {
  TRAVEL,
  COVID_STATUS_CHANGE,
  HIGHWAY_STATUS_CHANGE,
}

const EVENTS = [
  {
    type: EventType.TRAVEL,
    people: [People.ZHIMIN, People.BRAD, People.KAREN],
    destination: Locations.SODA_SPRINGS_CABIN,
    time: 'Friday morning',
  },
  {
    type: EventType.TRAVEL,
    people: [People.DEREK, People.DANNVER, People.DREW, People.JONATHAN],
    destination: Locations.DONNER_PASS_CABIN,
    time: 'Friday night',
  },
  {
    type: EventType.TRAVEL,
    people: [People.CHRISTIAN, People.CHARLIE, People.JOE],
    destination: Locations.DONNER_PASS_CABIN,
    time: 'Friday night',
  },
  {
    type: EventType.TRAVEL,
    people: [People.SETH, People.ALISON, People.HANYU],
    destination: Locations.DONNER_PASS_CABIN,
    time: 'Friday night',
  },
  {
    type: EventType.TRAVEL,
    people: [People.SETH, People.ALISON, People.JOE, People.DANNVER, People.DEREK],
    destination: Locations.PALISADES,
    time: 'Saturday morning',
  },
  {
    type: EventType.TRAVEL,
    people: [People.CHRISTIAN, People.DREW, People.JONATHAN],
    destination: Locations.SODA_SPRINGS_CABIN,
    time: 'Saturday morning',
  },
  {
    type: EventType.TRAVEL,
    people: [People.CHRISTIAN, People.DREW, People.JONATHAN, People.BRAD],
    destination: Locations.PALISADES,
    time: 'Saturday morning',
  },
  {
    type: EventType.TRAVEL,
    people: [People.KAREN, People.ZHIMIN],
    destination: Locations.DONNER_PASS_CABIN,
    time: 'Saturday morning',
  },
  {
    type: EventType.TRAVEL,
    people: [People.CHRISTIAN, People.DREW, People.JONATHAN, People.BRAD, People.DEREK],
    destination: Locations.TRUCKEE,
    time: 'Saturday afternoon',
  },
  {
    type: EventType.TRAVEL,
    people: [People.SETH, People.ALISON, People.JOE, People.DANNVER],
    destination: Locations.TRUCKEE,
    time: 'Saturday afternoon',
  },
  {
    type: EventType.TRAVEL,
    people: [People.CHRISTIAN, People.DREW, People.JONATHAN, People.BRAD, People.DEREK],
    destination: Locations.HOTEL,
    time: 'Saturday evening',
  },
  {
    type: EventType.TRAVEL,
    people: [People.SETH, People.ALISON, People.JOE, People.DANNVER],
    destination: Locations.HOTEL,
    time: 'Saturday evening',
  },
  {
    type: EventType.COVID_STATUS_CHANGE,
    people: [People.CHRISTIAN, People.BRAD],
    status: CovidStatus.INFECTED,
    time: 'Saturday night',
  },
  {
    type: EventType.TRAVEL,
    people: [People.SETH, People.ALISON, People.BRAD, People.DEREK, People.JONATHAN],
    destination: Locations.DONNER_PASS_CABIN,
    time: 'Sunday night',
  },
  {
    type: EventType.TRAVEL,
    people: [People.CHRISTIAN, People.JOE, People.DREW, People.DANNVER],
    destination: Locations.DONNER_PASS_CABIN,
    time: 'Monday morning',
  },
  {
    type: EventType.TRAVEL,
    people: [People.DEREK, People.DANNVER, People.JONATHAN, People.DREW],
    destination: Locations.BAY_AREA,
    time: 'Monday afternoon',
  },
  {
    type: EventType.TRAVEL,
    people: [People.CHRISTIAN, People.CHARLIE],
    destination: Locations.BAY_AREA,
    time: 'Monday afternoon',
  },
  {
    type: EventType.TRAVEL,
    people: [People.ZHIMIN, People.KAREN, People.BRAD],
    destination: Locations.BAY_AREA,
    time: 'Monday afternoon',
  },
  {
    type: EventType.TRAVEL,
    people: [People.SETH, People.ALISON, People.JOE, People.HANYU],
    destination: Locations.BAY_AREA,
    time: 'Monday afternoon',
  },
  {
    type: EventType.COVID_STATUS_CHANGE,
    people: [People.BRAD, People.DEREK],
    status: CovidStatus.TESTED_POSITIVE,
    time: 'Monday night',
  },
  {
    type: EventType.COVID_STATUS_CHANGE,
    people: [People.CHRISTIAN],
    status: CovidStatus.TESTED_POSITIVE,
    time: 'Tuesday morning',
  },
]

const deepcopy = (data) => JSON.parse(JSON.stringify(data));

interface PersonState {
  covidStatus: CovidStatus;
  location: Locations;
}

interface PeopleState {
  [person: number]: PersonState;
}

interface State {
  eventIndex: number;
  peopleState: PeopleState;
}

export default function CovidTracker() {
  const [history, setHistory] = useState<[State]>([{eventIndex: -1, peopleState: INITIAL_PEOPLE_STATE}]);
  const {eventIndex, peopleState} = history[history.length - 1];

  let currentLocations = []
  for (const location in Locations) {
    if (!isNaN(Number(location))) {
      let peopleAtLocation = [];
      for (const [person, {location: personLocation, covidStatus}] of Object.entries(peopleState)) {
        if (location == String(personLocation)) {
          peopleAtLocation.push(<li key={person}
            className={covidStatus === CovidStatus.HEALTHY ? 'healthy' : '' +
            (covidStatus === CovidStatus.INFECTED ? 'infected' : '') +
            (covidStatus === CovidStatus.TESTED_POSITIVE ? 'tested-positive' : '')}>
              {People[person]}</li>);
        }
      }
      currentLocations.push(
        <div key={location}>
          <h4>{Locations[location]}</h4>
          <ul>
            {peopleAtLocation}
          </ul>
        </div>);
    }
  }

  const updatePeopleLocations = (people, newLocation) => {
    const newPeopleState = deepcopy(peopleState);
    for (const person of people) {
      newPeopleState[person].location = newLocation;
    }
    return newPeopleState;
  }

  const updatePeopleCovidStatus = (people, status) => {
    const newPeopleState = deepcopy(peopleState);
    for (const person of people) {
      newPeopleState[person].covidStatus = status;
    }
    return newPeopleState;
  }

  const handleEvent = (event) => {
    switch (event.type) {
      case EventType.TRAVEL:
        return updatePeopleLocations(event.people, event.destination);
      case EventType.COVID_STATUS_CHANGE:
        return updatePeopleCovidStatus(event.people, event.status);
      default:
        console.error(`Unhandled event type ${event.type}`)
        return {}
    }
  }

  const advance = () => {
    if (eventIndex >= EVENTS.length - 1) return;
    const newEventIndex = eventIndex + 1;
    const newPeopleState = handleEvent(EVENTS[newEventIndex]);
    const newHistory = deepcopy(history);
    newHistory.push({eventIndex: newEventIndex, peopleState: newPeopleState});
    setHistory(newHistory);
  }

  const back = () => {
    if (eventIndex == -1) return;
    const newHistory = deepcopy(history);
    newHistory.pop();
    const {eventIndex: newEventIndex, peopleState: newPeopleState} = newHistory[newHistory.length - 1];
    setHistory(newHistory);
  }

  const restart = () => {
    setHistory([{eventIndex: -1, peopleState: INITIAL_PEOPLE_STATE}]);
  }

  return (
    <div>
      <h2>Covid Tracker</h2>
      <button disabled={eventIndex > -1 ? null : true} onClick={back}>Back</button>
      <button disabled={eventIndex >= EVENTS.length - 1 ? true : null} onClick={advance}>Advance</button>
      <button onClick={restart}>Restart</button>
      <p>Current time: {eventIndex >= 0 ? EVENTS[eventIndex].time : 'Friday morning'}</p>
      <p><b>Key:</b> COVID Status:{' '}
        <span style={{color: 'green'}}>healthy</span>{' '}
        <span style={{color: 'orange'}}>likely infected</span>{' '}
        <span style={{color: 'red'}}>tested positive</span>{' '}
      </p>
      <div className="current-locations">
        <h3>Locations:</h3>
        {currentLocations}
      </div>
    </div>
  );
}
