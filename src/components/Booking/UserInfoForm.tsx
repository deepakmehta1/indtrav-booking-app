// src/components/UserInfoForm.tsx
import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import './styles/UserInfoForm.css'; // Ensure this points to the UserInfoForm.css
import { createBooking } from '../../api/bookingService'; // Import the new createBooking function

interface UserInfoFormProps {
  formData: {
    mobile: string;
    firstName: string;
    lastName: string;
    gender: string;
    age: number | '';
    email: string;
    sharingType: string;
  };
  tripDetails: any; // Accept trip details
  handleMobileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLElement>) => void; // Change to HTMLElement
  token: string; // Prop for the Firebase token
  isMultipleBooking: boolean;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  formData,
  tripDetails,
  handleMobileChange,
  handleInputChange,
  token,
  isMultipleBooking,
}) => {
  const [additionalPersons, setAdditionalPersons] = useState<any[]>([{}]); // Start with one additional person

  const addPersonFields = () => {
    setAdditionalPersons((prev) => [...prev, {}]); // Add a new empty person object
  };

  const handlePersonChange = (
    index: number,
    e: React.ChangeEvent<HTMLElement>,
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement; // Cast target to correct type
    const { name, value } = target;
    setAdditionalPersons((prev) => {
      const updatedPersons = [...prev];
      updatedPersons[index] = {
        ...updatedPersons[index],
        [name]: value,
      };
      return updatedPersons;
    });
  };

  const removePerson = (index: number) => {
    setAdditionalPersons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const bookingData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      gender: formData.gender,
      age: formData.age ? formData.age : null, // Ensure age is a string
      sharing_type: formData.sharingType || null,
      trip_id: tripDetails?.id || null, // Assuming tripDetails contains the trip ID
      mobile: formData.mobile,
    };

    try {
      const response = await createBooking(bookingData, token);
      if (response.status === 'success') {
        // Handle success (e.g., navigate to the next step)
        console.log('Booking successful:', response.message);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      // Handle error appropriately (e.g., show a message)
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formMobile">
        <Form.Label className="form-label">Mobile</Form.Label>
        <Form.Control
          type="text"
          placeholder="10 digit Mobile Number"
          name="mobile"
          value={formData.mobile}
          onChange={handleMobileChange}
        />
      </Form.Group>
      <Row>
        <Col md={6}>
          <Form.Group controlId="formFirstName">
            <Form.Label className="form-label">First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formLastName">
            <Form.Label className="form-label">Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="formGender">
            <Form.Label className="form-label">Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formAge">
            <Form.Label className="form-label">Age</Form.Label>
            <Form.Control
              type="number"
              placeholder="Your Age"
              name="age"
              value={formData.age}
              min="0"
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="formEmail">
        <Form.Label className="form-label">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Your Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </Form.Group>

      {/* Dropdown for sharing type */}
      <Form.Group controlId="formSharingType" className="mt-3">
        <Form.Label className="form-label">Select Sharing Type</Form.Label>
        <Form.Control
          as="select"
          name="sharingType"
          value={formData.sharingType}
          onChange={handleInputChange}
        >
          <option value="">Select Sharing Type</option>
          <option value="double_sharing">
            Double Sharing - ₹{tripDetails?.double_sharing_price || 0}
          </option>
          <option value="triple_sharing">
            Triple Sharing - ₹{tripDetails?.triple_sharing_price || 0}
          </option>
          <option value="quad_sharing">
            Quad Sharing - ₹{tripDetails?.quad_sharing_price || 0}
          </option>
        </Form.Control>
      </Form.Group>

      {/* Additional Persons Section */}
      {isMultipleBooking && ( // Conditionally render this section
        <>
          <h4
            className="mt-4 add-more-persons-title"
            style={{ color: 'white' }}
          >
            👥 Add More Persons
          </h4>
          {additionalPersons.map((_, index) => (
            <div key={index} className="additional-person-fields mb-3">
              <Row>
                <Col md={4}>
                  <Form.Group controlId={`firstName${index}`}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      onChange={(e) => handlePersonChange(index, e)} // Pass the event here
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId={`lastName${index}`}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      onChange={(e) => handlePersonChange(index, e)} // Pass the event here
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId={`age${index}`}>
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Age"
                      name="age"
                      min="0"
                      onChange={(e) => handlePersonChange(index, e)} // Pass the event here
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId={`gender${index}`}>
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      onChange={(e) => handlePersonChange(index, e)} // Pass the event here
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                  <Button variant="danger" onClick={() => removePerson(index)}>
                    Remove
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <Button variant="info" onClick={addPersonFields} className="mt-3">
            ➕ Add Another Person
          </Button>
        </>
      )}

      <Button variant="primary" type="submit" className="btn-block mt-3">
        Continue Payment
      </Button>
    </Form>
  );
};

export default UserInfoForm;
