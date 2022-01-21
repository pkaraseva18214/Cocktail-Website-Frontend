import React from 'react'

import {
    Button, Modal, Message, toaster, Panel, Loader, Form, Input, CheckboxGroup
} from 'rsuite';

import 'rsuite/dist/rsuite.min.css';
import { baseUrl } from '../utils/api';

import { Tags, ingrToString } from './Components'
import allTags from '../json/tags.json';

import styles from '../css/Card.module.css';

import { StepInputControl, ProductInputControl, Textarea, PrintTags, Field, model } from './MyModal';

export const RecipeViewModalEdit = ({ data, onDelete, onUpdate }) => {

    const [open, setOpen] = React.useState(false);
    const [req, setReq] = React.useState(true);
    const [recipeData, setRecipeData] = React.useState({});

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setReq(true);
        setOpen(false);
        setRecipeData({})
    }

    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});

    const [formValue, setFormValue] = React.useState({
        ingredients: [{ label: '', value: '' }],
        steps: ['']
    });

    const messageError = (
        <Message showIcon type="error" >
            Аn error has occured, please try later.
        </Message>
    );

    const messageSuccess = (action) => {
        if (action === "delete") {
            return <Message showIcon type="warning" >
                Recipe was deleted.
            </Message>
        } else if (action === "publish") {
            return <Message showIcon type="success" >
                Recipe was published.
            </Message>
        } else {
            return <Message showIcon type="success" >
                Recipe was edited.
            </Message>
        }
    }

    const handleEntered = async () => {

        try {
            const response = await fetch(`${baseUrl}/recipe/${data.id}`, {
                mode: 'cors',
                credentials: 'include',
            })

            if (!response.ok) {
                toaster.push(messageError);
            } else {
                const json = await response.json();
                setFormValue(json)
                setReq(false)
            }

        } catch (error) {
            console.log(error)
        }

    };

    const handlePublish = async () => {

        let newData = {
            title: formValue.title,
            description: formValue.description,
            tags: formValue.tags,
            iconUrl: formValue.iconUrl,
            steps: formValue.steps,
            ingredients: formValue.ingredients
        }

        console.log(newData);

        try {
            // first we should save it (may be it was edit)
            const response = await fetch(`${baseUrl}/recipe/${data.id}`, {
                mode: 'cors',
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData)
            })

            if (!response.ok) {
                toaster.push(messageError);
            } else {

                try {
                    // then we send request to publish it 
                    const response = await fetch(`${baseUrl}/recipe/${data.id}/publish`, {
                        mode: 'cors',
                        credentials: 'include',
                        method: 'POST'
                    })

                    if (!response.ok) {
                        toaster.push(messageError);
                    } else {
                        toaster.push(messageSuccess("publish"));
                        onDelete(recipeData.id);
                        handleClose();
                    }

                } catch (error) {
                    toaster.push(messageError);
                }
            }

        } catch (error) {
            toaster.push(messageError);
        }
    };

    const handleEdit = async () => {

        let newData = {
            title: formValue.title,
            description: formValue.description,
            tags: formValue.tags,
            iconUrl: formValue.iconUrl,
            steps: formValue.steps,
            ingredients: formValue.ingredients
        }

        console.log(newData);

        try {
            const response = await fetch(`${baseUrl}/recipe/${data.id}`, {
                mode: 'cors',
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData)
            })

            if (!response.ok) {
                toaster.push(messageError);
            } else {
                toaster.push(messageSuccess("edit"));
                onUpdate();
                handleClose();
            }

        } catch (error) {
            toaster.push(messageError);
        }
    };

    const handleDelete = async () => {

        try {
            const response = await fetch(`${baseUrl}/recipe/${data.id}`, {
                mode: 'cors',
                credentials: 'include',
                method: 'DELETE'
            })

            if (!response.ok) {
                toaster.push(messageError);
            } else {
                toaster.push(messageSuccess("delete"));
                onDelete(recipeData.id);
                handleClose();
            }

        } catch (error) {
            toaster.push(messageError);
        }
    };

    return (

        <div className="modal-container" >

            <Panel shaded bordered bodyFill className={styles.card} onClick={handleOpen}>
                <img alt="pic" src={data.iconUrl} style={{ objectFit: 'cover' }} height="240" width="360" />
                <Panel header={data.title}>

                    <Tags recipe_tags={data.tags} size="lg" />

                    <p style={{ padding: '12px 0px 0px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Ingredients: {ingrToString(data.ingredients)}</p>

                </Panel>
            </Panel>

            <Modal backdrop="static" size="lg"
                open={open}
                onClose={handleClose}
                onEntered={handleEntered}
                onExited={() => {
                    setReq(true);
                    setRecipeData({});
                }}
            >

                <Modal.Header>
                    <Modal.Title>Create new recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {req ? (
                        <div style={{ textAlign: 'center' }}>
                            <Loader size="md" />
                        </div>
                    ) : (

                        <Form
                            ref={formRef}
                            onChange={setFormValue}
                            onCheck={setFormError}
                            formValue={formValue}
                            model={model}
                        >
                            <Field name="title" label="Title" accepter={Input} message="Requied" />

                            <Field name="description" label="Description" accepter={Textarea} message="Requied" />

                            <Field
                                name="tags"
                                label="Tags"
                                accepter={CheckboxGroup}
                                message="Required"
                                inline
                            >
                                <PrintTags tags={allTags.tags} />
                            </Field>

                            <Field name="iconUrl" label="iconUrl" accepter={Textarea} message="Requied" />

                            <div style={{ padding: '0 0 12px' }}>
                                <Form.Control
                                    name="steps"
                                    accepter={StepInputControl}
                                />
                            </div>

                            <div style={{ padding: '12px 0 48px' }}>
                                <Form.Control
                                    name="ingredients"
                                    accepter={ProductInputControl}
                                    fieldError={formError.ingredients}
                                />
                            </div>

                        </Form>

                    )}

                </Modal.Body>

                <Modal.Footer>
                    <Button color='red' onClick={handleDelete} appearance="ghost">
                        Delete
                    </Button>
                    <Button onClick={handleEdit} appearance="ghost">
                        Edit
                    </Button>
                    <Button onClick={handlePublish} appearance="primary">
                        Publish
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
}