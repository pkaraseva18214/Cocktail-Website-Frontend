import React from 'react'

import {
    Input, Checkbox, Form, CheckboxGroup, Button, Modal, Schema, ButtonToolbar, Message, toaster
} from 'rsuite';

import './../css/index.css';
import 'rsuite/dist/rsuite.min.css';

import allTags from '../json/tags.json';
import { baseUrl } from '../utils/api';

export const PrintTags = ({ tags }) => {
    const array = [];

    tags.forEach((item, i) => array.push(
        <Checkbox value={item} key={'tag' + i}>{item}</Checkbox>
    ));

    return <div>{array}</div>
}

export const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const { ArrayType, StringType, ObjectType } = Schema.Types;

export const model = Schema.Model({
    ingredients: ArrayType().of(
        ObjectType().shape({
            label: StringType().isRequired('Required.'),
            value: StringType().isRequired('Required.')
        })),
    title: StringType().isRequired('Required'),
    tags: ArrayType()
        .minLength(1, 'Please select at least 1 tag')
        .isRequired('Required.'),
    description: StringType().isRequired('Required'),
    iconUrl: StringType().isRequired('Required')

});

export const Field = React.forwardRef((props, ref) => {
    const { name, message, label, accepter, error, ...rest } = props;
    return (
        <Form.Group controlId={`${name}-10`} ref={ref} className={error ? 'has-error' : ''}>
            <Form.ControlLabel>{label} </Form.ControlLabel>
            <Form.Control name={name} accepter={accepter} errorMessage={error} {...rest} style={{ width: '100%' }} />
            <Form.HelpText>{message}</Form.HelpText>
        </Form.Group>
    );
});

const ErrorMessage = ({ children }) => <span style={{ color: 'red' }}>{children}</span>;
const Cell = ({ children, style, ...rest }) => (
    <td style={{ padding: '2px 16px 2px 0', verticalAlign: 'top', ...style }} {...rest}>
        {children}
    </td>
);

const ProductItem = ({ rowValue = {}, onChange, rowIndex, rowError }) => {
    const handleChangeName = value => {
        onChange(rowIndex, { ...rowValue, label: value });
    };
    const handleChangeAmount = value => {
        onChange(rowIndex, { ...rowValue, value: value });
    };

    return (
        <tr>
            <Cell>
                <Input value={rowValue.label} onChange={handleChangeName} />
                {rowError ? <ErrorMessage>{rowError.label.errorMessage}</ErrorMessage> : null}
            </Cell>
            <Cell>
                <Input value={rowValue.value} onChange={handleChangeAmount} />
                {rowError ? <ErrorMessage>{rowError.value.errorMessage}</ErrorMessage> : null}
            </Cell>
        </tr>
    );
};

export const ProductInputControl = ({ value = [], onChange, fieldError }) => {
    const errors = fieldError ? fieldError.array : [];
    const [ingredients, setProducts] = React.useState(value);
    const handleChangeProducts = nextProducts => {
        setProducts(nextProducts);
        onChange(nextProducts);
    };
    const handleInputChange = (rowIndex, value) => {
        const nextProducts = [...ingredients];
        nextProducts[rowIndex] = value;
        handleChangeProducts(nextProducts);
    };

    const handleMinus = () => {
        if (ingredients.length > 1) {
            handleChangeProducts(ingredients.slice(0, -1))
        }
    };
    const handleAdd = () => {
        handleChangeProducts(ingredients.concat([{ label: '', value: null }]));
    };
    return (
        <table style={{ width: '100%' }}>
            <thead>
                <tr>
                    <Cell>Ingredient (e.g. 'lime' or 'white rum')</Cell>
                    <Cell>Amount (e.g. 'lime, cut into 4 wedges' or '10 and a half fluid ounces white rum)'</Cell>
                </tr>
            </thead>
            <tbody>
                {ingredients.map((rowValue, index) => (
                    <ProductItem
                        key={index}
                        rowIndex={index}
                        rowValue={rowValue}
                        rowError={errors[index] ? errors[index].object : null}
                        onChange={handleInputChange}
                    />
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <Cell colSpan={2} style={{ paddingTop: '10' }}>
                        <ButtonToolbar>
                            <Button onClick={handleAdd} appearance="default">Add next ingredient</Button>
                            <Button onClick={handleMinus} appearance="default">Delete last ingredient</Button>
                        </ButtonToolbar >
                    </Cell>
                </tr>
            </tfoot>
        </table>
    );
};

const StepItem = ({ rowValue, onChange, rowIndex, rowError }) => {
    const handleChangeName = value => {
        onChange(rowIndex, value);
    };

    return (
        <tr>
            <Cell>
                <Input name="step" as="textarea" value={rowValue} onChange={handleChangeName} required />
            </Cell>
        </tr>
    );
};

export const StepInputControl = ({ value = [], onChange, fieldError }) => {
    const errors = fieldError ? fieldError.array : [];
    const [steps, setProducts] = React.useState(value);
    const handleChangeProducts = nextProducts => {
        setProducts(nextProducts);
        onChange(nextProducts);
    };
    const handleInputChange = (rowIndex, value) => {
        const nextProducts = [...steps];
        nextProducts[rowIndex] = value;
        handleChangeProducts(nextProducts);
    };

    const handleMinus = () => {
        if (steps.length > 1) {
            handleChangeProducts(steps.slice(0, -1))
        }
    };
    const handleAdd = () => {
        if (steps.length < 3) {
            handleChangeProducts(steps.concat(['']));
        }
    };
    return (
        <table style={{ width: '100%' }}>
            <thead>
                <tr>
                    <Cell>Steps</Cell>
                </tr>
            </thead>
            <tbody>
                {steps.map((rowValue, index) => (
                    <StepItem
                        key={index}
                        rowIndex={index}
                        rowValue={rowValue}
                        rowError={errors[index] ? errors[index].object : null}
                        onChange={handleInputChange}
                    />
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <Cell colSpan={2} style={{ paddingTop: '10' }}>
                        <ButtonToolbar>
                            <Button onClick={handleAdd} appearance="default">Add next step</Button>
                            <Button onClick={handleMinus} appearance="default">Delete last step</Button>
                        </ButtonToolbar >
                    </Cell>
                </tr>
            </tfoot>
        </table>
    );
};

export const MyModal = () => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
        if (action === "publish") {
            return <Message showIcon type="success" >
                Recipe was send to moderation.
            </Message>
        } else {
            return <Message showIcon type="success" >
                Recipe was saved to drafts.
            </Message>
        }
    }

    async function createRecipe(postData) {
        try {
            const res = await fetch(`${baseUrl}/recipe`, {
                method: "post",
                mode: 'cors',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData)
            });

            if (!res.ok) {
                toaster.push(messageError);
            } else {
                const data = await res.json();
                console.log(data)
                toaster.push(messageSuccess('drafts'));
                handleClose()
            }

        } catch (err) {
            toaster.push(messageError);
        }
    }

    async function createAndPublish(postData) {

        try {
            const res = await fetch(`${baseUrl}/recipe`, {
                method: "post",
                mode: 'cors',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData)
            });

            if (!res.ok) {
                toaster.push(messageError);
            } else {
                const data = await res.json();
                console.log(data)

                try {
                    const response = await fetch(`${baseUrl}/recipe/${data.id}/publish`, {
                        mode: 'cors',
                        credentials: 'include',
                        method: 'POST'
                    })
        
                    if (!response.ok) {
                        toaster.push(messageError);
                    } else {
                        toaster.push(messageSuccess("publish"));
                        handleClose();
                    }
        
                } catch (error) {
                    toaster.push(messageError);
                }

            }

        } catch (err) {
            toaster.push(messageError);
        }

    }

    const handleSubmit = () => {
        if (formRef.current.check()) {
            createRecipe(formValue);
        }
    };

    const handlePublish = () => {
        if (formRef.current.check()) {
            createAndPublish(formValue);
        }
    };

    return (
        <div className="modal-container" style={{ padding: '0 0 24px' }}>

            <Button onClick={() => handleOpen('lg')}>
                Create new recipe
            </Button>

            <Modal backdrop="static" size="lg" open={open} onClose={handleClose}>

                <Modal.Header>
                    <Modal.Title>Create new recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>

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

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} appearance="ghost">
                        Save in drafts
                    </Button>
                    <Button onClick={handlePublish} appearance="primary">
                        Send for moderation
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};