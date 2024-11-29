import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Modal, Form, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Subcategories.css'
function SubcategoriesPages() {
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  
  
  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  useEffect(() => {
    
    if (searchQuery === "") {
      setFilteredSubcategories(subcategories);
    } else {
      const filtered = subcategories.filter(subcategory =>
        subcategory.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubcategories(filtered);
    }
  }, [searchQuery, subcategories]);

  const fetchSubcategories = () => {
    axios.get("http://localhost:3000/api/subcategories/getall")
      .then((response) => {
        setSubcategories(response.data);
        setFilteredSubcategories(response.data); 
      })
      .catch((error) => console.error('Failed to fetch subcategories', error));
  };

  const fetchCategories = () => {
    axios.get("http://localhost:3000/api/categories/getall")
      .then(response => setCategories(response.data))
      .catch(error => console.error('Failed to fetch categories', error));
  };

  
  const initialValues = {
    title: '',
    categories: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    categories: Yup.array().min(1, 'At least one category is required'),
  });

  const handleSubmit = (values) => {
    const newSubcategories = {
      title: values.title,
      categories: values.categories,
    };

    axios.post("http://localhost:3000/api/subcategories/create", newSubcategories)
      .then((response) => {
        setShowModal(false);
        fetchSubcategories(); 
      })
      .catch((error) => console.error('Failed to create Subcategories', error));
  };

  return (
    <div>
      <h5 className="text-center mb-4" style={{ marginTop: "20px", fontFamily:"cursive",fontWeight:"800", color:'white' }}>
        SUBCATEGORIES
      </h5>
      
    
      <FormControl
        type="text"
        placeholder="Search subcategories..."
        className="mb-4 search-box"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      <Container className="mt-4">
        {filteredSubcategories.map((sub) => (
          <Card style={{ width: '18rem' }} className="shadow" key={sub._id}>
            <Card.Img
              variant="top"
              src={sub.image}
              alt={sub.title}
              style={{ height: '180px', objectFit: 'cover' }}
            />
            <Card.Body className="text-center">
              <Card.Title>{sub.title}</Card.Title>
              <Card.Text>
                Category: {sub.categories.map((category) => category.title).join(', ')}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Container>

      <Button variant="primary" className="add-cuisine-button" onClick={() => setShowModal(true)}>
        Add New Subcategory
      </Button>

      
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>ADD Subcategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, errors, touched }) => (
              <FormikForm>
                <Form.Group className="mb-3" controlId="formSubcategoriesTitle">
                  <Form.Label>Title</Form.Label>
                  <Field
                    type="text"
                    name="title"
                    as={Form.Control}
                    isInvalid={touched.title && errors.title}
                  />
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categories</Form.Label>
                  <Select
                    isMulti
                    options={categories.map(category => ({ value: category._id, label: category.title }))}
                    onChange={(selectedOptions) => setFieldValue('categories', selectedOptions.map(option => option.value))}
                    value={values.categories.map(value => ({ value, label: categories.find(c => c._id === value)?.title }))}
                    placeholder="Select categories"
                  />
                  {touched.categories && errors.categories && (
                    <div className="text-danger">{errors.categories}</div>
                  )}
                </Form.Group>

                <Modal.Footer>
                  <Button variant="success" type="submit">
                    Submit
                  </Button>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                </Modal.Footer>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SubcategoriesPages;
