const fs = require('fs');

const gdPath = 'e:/laravel/night/night-club/src/pages/GirlDashboard.jsx';
const wwuPath = 'e:/laravel/night/night-club/src/pages/WorkWithUs.jsx';

const gdContent = fs.readFileSync(gdPath, 'utf8');
let wwuContent = fs.readFileSync(wwuPath, 'utf8');

// 1. Extract modals
const modalStartIndex = gdContent.indexOf('{/* Choice Modal - Room vs Nightclub */}');
const modalEndIndex = gdContent.indexOf('<Footer />');
let modals = gdContent.slice(modalStartIndex, modalEndIndex);

modals = modals.replace(/fetchReservations\(\)/g, 'fetchData()');

// 2. Add state
const oldState = `  const [showReservationModal, setShowReservationModal] = useState(false);`;
const newState = `  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showNcModal, setShowNcModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedAvailDates, setSelectedAvailDates] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqMsg, setReqMsg] = useState(null);
  const [ncReqFrom, setNcReqFrom] = useState("");
  const [ncReqTo, setNcReqTo] = useState("");
  const [ncReqLoading, setNcReqLoading] = useState(false);
  const [ncReqMsg, setNcReqMsg] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");`;

wwuContent = wwuContent.replace(oldState, newState);

// 3. Add LOCATIONS
const oldPrices = `  const PRICES = {`;
const newLocations = `  const LOCATIONS = [
    { id: "braunau", label: "Pascha Laufhaus - Braunau am Inn" },
    { id: "salzburg", label: "Pascha Laufhaus - Salzburg" },
  ];

  const PRICES = {`;
wwuContent = wwuContent.replace(oldPrices, newLocations);

// 4. Remove old modal and replace button
const btnSearch = `onClick={() => setShowReservationModal(true)}`;
wwuContent = wwuContent.replace(btnSearch, `onClick={() => setShowChoiceModal(true)}`);

const overlayStart = wwuContent.indexOf('{/* Reservation Modal Overlay */}');
if(overlayStart !== -1) {
    // Find the end of the overlay which is just before `</>`
    const overlayEndSearch = `                  </>\n                )`;
    const overlayEnd = wwuContent.indexOf(overlayEndSearch, overlayStart);
    if(overlayEnd !== -1) {
        wwuContent = wwuContent.slice(0, overlayStart) + wwuContent.slice(overlayEnd);
    }
}

// 5. Inject new modals
wwuContent = wwuContent.replace('<Footer />', modals + '\n      <Footer />');

fs.writeFileSync(wwuPath, wwuContent);
console.log("Migration successful");
