const API_WEATHER = "http://api.weatherstack.com/current?access_key=db7cf9bb4b1b1d08cc1bd4f2297f4812";

let store = {
    city: 'Tyumen',
    temperature: 0,
    observationTime: "00:00",
    description: '',
    windSpeed: 0,
    humidity: 0,
    properties: {
        cloudcover: {},
        visibility: {},
        pressure: {},
        uvIndex: {},
    },
}

const root = document.querySelector('.root');
const popup = document.querySelector('.popup');
const input = document.querySelector('.form-input');
const form = document.querySelector('form');
const close = document.querySelector('.popup-close');




const fetchData = async () => {
    try {
        const query = localStorage.getItem("query") || store.city;
        const result = await fetch(`${API_WEATHER}&query=${query}`);
        const data = await result.json();
    
        console.log(data);
    
        const { 
            current: {
                temperature,
                cloudcover, 
                pressure,
                humidity,
                observation_time: observationTime, 
                uv_index: uvIndex,
                visibility, 
                weather_descriptions: description, 
                wind_speed: windSpeed,
            },
            location : { name: city },
    
        } = data; 
    
    
    
        store = {
            ...store,
            temperature, 
            city,
            description,
            humidity, 
            windSpeed,
            properties: {
                cloudcover: {
                    title: "cloudcover",
                    value: `${cloudcover}%`,
                    icon: "cloud.png",
                },
                visibility: {
                    title: "visibility",
                    value: `${visibility}%`,
                    icon: "visibility.png",
                },
                pressure: {
                    title: "pressure",
                    value: `${pressure}Pa`,
                    icon: "gauge.png",
                },
                uvIndex: {
                    title: "uv Index",
                    value: `${uvIndex} / 100`,
                    icon: "uv-index.png",
                },
            }
    
        }
    
        renderComponent();
    } catch (err) {
        console.log(err);
    }

};

const renderProperties = (properties) => {

    return Object.values(properties).map(({ title, icon, value }) => {
        return `
        <div class="properties-wrapper">
            <div class="properties-img">
                <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="properties-info">
                <div class="properties-info__description">${title}</div>
                <div class="properties-info__value">${value}</div>
            </div>
        </div>
    `;
    }).join(''); 
};

const markup = () => {
  
    const { city, description, humidity, temperature, windSpeed, properties} = store;

    return `
    <div class="container">
        <div class="top">
            <div class="top-wrapper">
                <div>
                    <div class="temp">
                        <div class="temp-deg">${temperature}&deg</div>
                        <div class="temp-img">
                            <img src="./img/${getImage(String(description))}" alt="${description}">
                        </div>
                    </div>
                    <div class="value">
                        <div class="value-descr">Humidity: ${humidity}&#37;</div>
                        <div class="value-descr">Wind: ${windSpeed}km/h</div>
                    </div>

                    <div class="city">
                        <div class="temp-text">${description}</div>
                        <div class="city-name">${city}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="properties">${renderProperties(properties)}</div>
    </div>
    `;
};
function getImage(description) {
    /* приводим описание к нижнему регистру, чтобы в логи свитч не тратить время на написание слов в правильном регистре */
    const value = description.toLowerCase();
  
  
  switch (value) {
    case "partly cloudy":
      return "partly.png";
    case "cloud":
      return "cloud.png";
    case "fog":
      return "fog.png";
    case "sunny":
      return "sunny.png";
    case "overcast":
      return "cloud.png";
    default:
      return "clear.png";
  };
  
}

const togglePopupClass = () => {
    popup.classList.toggle('active');
};

const renderComponent = () => {
    root.innerHTML = markup();

    const city = document.querySelector('.city-name');
    city.addEventListener('click', togglePopupClass);
};

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value,
    };
};

const handleSubmit = (e) => {
    e.preventDefault();

    const value = store.city;
    if (!value) return null;
    localStorage.setItem("query", value);
  

    fetchData();
    togglePopupClass();
};


input.addEventListener('input', handleInput);
form.addEventListener('submit', handleSubmit);
close.addEventListener('click', togglePopupClass);



fetchData();