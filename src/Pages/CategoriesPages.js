import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal, Alert, Form, FormControl } from "react-bootstrap";
import { Formik, Field, Form as FormikForm } from "formik";
import * as Yup from "yup";
import './CategoriesPages.css';
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

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    
    axios
      .get("http://localhost:3000/api/categories/getall")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Failed to fetch categories", error));
  }, []);

  useEffect(() => {
   
    const filtered = categories.filter((category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]); 

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("image", values.image);

    axios
      .post("http://localhost:3000/api/categories/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setCategories([...categories, response.data]);
        setShowModal(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((error) => {
        console.error("Failed to create category", error.response?.data || error.message);
      });
  };

  return (
    <div>
      <h5 className="text-center mb-4" style={{ marginTop: "20px", fontFamily:"cursive",fontWeight:"800", color:'white'}}>CATEGORIES</h5>

      {showAlert && <Alert variant="success" className="text-center">Category added successfully!</Alert>}

      
      <FormControl
        type="text"
        placeholder="Search categories..."
        className="mb-4 search-box"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '33%', marginBottom: '20px' }}
      />

      <div className="container">
        {filteredCategories.map((category) => (
          <Card className="shadow" key={category._id}>
            <Card.Img
              variant="top"
              src={`http://localhost:3000/${category.image}`}
              alt={category.title}
              style={{ height: "180px", objectFit: "cover" }}
            />
            <Card.Body className="text-center">
              <Card.Title>{category.title}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Button variant="primary" className="add-cuisine-button" onClick={() => setShowModal(true)}>
        Add New Category
      </Button>

      <Modal show={showModal} size="lg" onHide={() => setShowModal(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">ADD CATEGORY</Modal.Title>
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
                <Form.Group className="mb-3" controlId="formCategoryTitle">
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

                <Form.Group className="mb-3" controlId="formCategoryImage">
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

export default CategoriesPage;
