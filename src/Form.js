import React, { useState } from 'react';
import uniqueValues from './unique_values';
import $ from 'jquery';

function Form() {
  const [selectedModel, setSelectedModel] = useState('');
  const [formData, setFormData] = useState({
    ROAD_CLASS: '',
    DISTRICT: '',
    LOCCOORD: '',
    TRAFFCTL: '',
    VISIBILITY: '',
    LIGHT: '',
    RDSFCOND: '',
    IMPACTYPE: '',
    INVTYPE: '',
    INVAGE: '',
    INJURY: '',
    INITDIR: '',
    MANOEUVER: '',
    DRIVACT: '',
    PEDTYPE: '',
    CYCACT: '',
    PEDESTRIAN: '',
    CYCLIST: '',
    AUTOMOBILE: '',
    MOTORCYCLE: '',
    TRUCK: '',
    TRSN_CITY_VEH: '',
    PASSENGER: '',
    SPEEDING: '',
    AG_DRIV: '',
    REDLIGHT: '',
    ALCOHOL: '',
    NEIGHBOURHOOD_158: ''
  });
  const [fatalAccident, setFatalAccident] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           formData
        })
      });

      const data = await response.json();

      // Check if the accident was fatal and set the state accordingly
    setFatalAccident(data.prediction === 'fatal');
    // Trigger the modal to show up
    
    setModalOpen(true);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };


  return (
    <div className="container">
      <h2>Accident Prediction Form</h2>
      <form onSubmit={handleSubmit}>

        {Object.entries(formData).map(([key, value]) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key}</label>
            <select
              className="form-control"
              id={key}
              name={key}
              value={value}
              onChange={handleInputChange}
            >
              <option value="">Select {key}</option>
              {uniqueValues[key].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

{/* Bootstrap Modal */}
{modalOpen && (
        <div className="modal fade show" id="fatalAccidentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Accident Information</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setModalOpen(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {fatalAccident !== null && (
                  <p>The accident was {fatalAccident ? 'fatal' : 'not fatal'}.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Form;