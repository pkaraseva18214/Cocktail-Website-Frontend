import React from 'react'

import {
    Input, Form, Button, Panel, Checkbox, CheckboxGroup, Schema
} from 'rsuite';

import './../css/index.css';
import 'rsuite/dist/rsuite.min.css';

import allTags from '../json/tags.json';

const PrintTags = ({ tags }) => {
    const array = [];

    tags.forEach((item, i) => array.push(
        <Checkbox value={item} key={'tag' + i}>{item}</Checkbox>
    ));

    return <div>{array}</div>
}

const Field = React.forwardRef((props, ref) => {
    const { name, message, label, accepter, error, ...rest } = props;
    return (
        <Form.Group controlId={`${name}-10`} ref={ref} className={error ? 'has-error' : ''}>
            <Form.ControlLabel>{label} </Form.ControlLabel>
            <Form.Control name={name} accepter={accepter} errorMessage={error} {...rest} style={{ width: '100%' }} />
            <Form.HelpText>{message}</Form.HelpText>
        </Form.Group>
    );
});

const { ArrayType } = Schema.Types;

const model = Schema.Model({
  tags: ArrayType()
    .maxLength(1, 'Please select only 1 tag')
});

export const SearchForm = ({...props}) => {

    const formRef = React.useRef();
    const [formValue, setFormValue] = React.useState({
        author: '',
        query: '',
        tags: [],
        ingredient: '',
        limit: 100,
        offset: 0
    });

    const handleSubmit = () => {
        props.sendSearchReq(formValue);
    };

    return (
        <Panel header="Search" collapsible bordered >
            <Form
                ref={formRef}
                onChange={setFormValue}
                formValue={formValue}
                model={model}>

                <Field name="query" label="Search by name" accepter={Input} />

                <Field name="author" label="Search by author" accepter={Input} />

                <Field
                    name="tags"
                    label="Tag"
                    accepter={CheckboxGroup}
                    inline
                >
                    <PrintTags tags={allTags.tags} />
                </Field>

                <Field
                    name="ingredient"
                    label="Ingredients"
                    accepter={Input}
                />

                <Button onClick={handleSubmit} appearance="primary">
                    Search for recipes
                </Button>

            </Form>
        </Panel>
    );
};