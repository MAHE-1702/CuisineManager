import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal, Alert, Form, FormControl } from "react-bootstrap";
import { Formik, Field, Form as FormikForm } from "formik";

import * as Yup from "yup";
import './CuisinesPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(1, 'Title should be at least 3 characters long')
    .max(50, 'Title should be less than 50 characters'),
  image: Yup.mixed()
    .required('Image is required')
    .test('fileSize', 'File too large', (value) => value && value.size <= 5 * 1024 * 1024)
    .test('fileFormat', 'Unsupported Format', (value) => value && ['image/jpeg', 'image/png'].includes(value.type)),
});

function CuisinesPage() {
  const [cuisines, setCuisines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCuisines();
  }, []);

  const fetchCuisines = () => {
    axios
      .get("https://cuisinemanagerbackend.onrender.com/api/cuisines/getall")
      .then((response) => setCuisines(response.data))
      .catch((error) => console.error("Failed to fetch cuisines", error));
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("image", values.image);

    axios
      .post("https://cuisinemanagerbackend.onrender.com/api/cuisines/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setCuisines([...cuisines, response.data]);
        setShowModal(false);
        setShowAlert(true);
        fetchCuisines();
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((error) => {
        console.error("Failed to create cuisine", error.response?.data || error.message);
      });
  };

  const filteredCuisines = cuisines.filter((cuisine) =>
    cuisine.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h5 className="text-center mb-4" style={{ marginTop: "20px", fontFamily:"cursive",fontWeight:"800", color:'white' }}>CUISINES</h5>

      {showAlert && <Alert variant="success" className="text-center">Cuisine added successfully!</Alert>}

      {/* Search Bar */}
      <FormControl
        type="text"
        placeholder="Search cuisines..."
        className="mb-4 search-box"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
        style={{ width: '33%', marginBottom: '20px' }}
      />

      <div className="container">
        {filteredCuisines.map((cuisine) => (
          <Card className="shadow" key={cuisine._id}>
            <Card.Img
              variant="top"
              src={`https://cuisinemanagerbackend.onrender.com/${cuisine.image}`}
              alt={cuisine.title}
              style={{ height: "180px", objectFit: "cover" }}
            />
            <Card.Body className="text-center">
              <Card.Title>{cuisine.title}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Button variant="primary" className="add-cuisine-button" onClick={() => setShowModal(true)}>
        Add New Cuisine
      </Button>

      <Modal show={showModal} size="lg" onHide={() => setShowModal(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">ADD CUISINES</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              title: '',
              image: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched }) => (
              <FormikForm>
                <Form.Group className="mb-3" controlId="formCuisineTitle">
                  <Form.Label>Title</Form.Label>
                  <Field
                    name="title"
                    type="text"
                    className="form-control"
                  />
                  {errors.title && touched.title ? (
                    <div className="text-danger">{errors.title}</div>
                  ) : null}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCuisineImage">
                  <Form.Label>Image</Form.Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue("image", e.target.files[0])}
                    className="form-control"
                  />
                  {errors.image && touched.image ? (
                    <div className="text-danger">{errors.image}</div>
                  ) : null}
                </Form.Group>

                <Modal.Footer>
                  <Button variant="success" type="submit">Submit</Button>
                  <Button onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CuisinesPage;
