import React from 'react'

import {
    Navbar, Nav, Breadcrumb, Tag, TagGroup, FlexboxGrid, List, Steps
} from 'rsuite';
import { Link } from 'react-router-dom';

import 'rsuite/dist/rsuite.min.css';

import styles from '../css/Card.module.css';

import { RecipeViewModal } from './RecipeView.js'
import { RecipeViewModalEdit } from './RecipeViewModalEdit';

const MyLink = React.forwardRef((props, ref) => {
    const { href, as, ...rest } = props;
    return (
        // eslint-disable-next-line
        <Link to={href} as={as}><a ref={ref} {...rest} /></Link>
    );
});

/*
Navbar 
state = NOT_LOGGED_IN or LOGGED_IN
*/
export const NavBar = ({ state }) => {
    return (
        <Navbar>
            <Nav>
                <Nav.Item as={MyLink} href="/home">COCKTAIL WEBSITE</Nav.Item>
                {state === 'LOGGED_IN' ?
                    <>
                        <Nav.Item as={MyLink} href="/home">Home</Nav.Item>
                    </> : <> </>}
            </Nav>

            <Nav pullRight>
                {state === 'LOGGED_IN' ?
                    <>
                        <Nav.Item as={MyLink} href="/account">Account</Nav.Item>
                        <Nav.Item as={MyLink} href="/logout">Log out</Nav.Item>
                    </> : <>
                        <Nav.Item as={MyLink} href="/login">Log in</Nav.Item>
                        <Nav.Item as={MyLink} href="/signup">Sign up</Nav.Item>
                    </>}
            </Nav>
        </Navbar>
    )
}

/*
Breadcrumb.
Home > {cocktail name}
*/
export const MyBreadcrumb = ({ separator, title }) => {
    return (
        <Breadcrumb separator={separator}>
            <Breadcrumb.Item as={MyLink} href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>{title}</Breadcrumb.Item>
        </Breadcrumb>
    )
}

/*
tags from json
for DOM use:

<Tags />

*/
export const Tags = ({ recipe_tags, size }) => {
    const tags = [];

    recipe_tags.forEach(item => tags.push(
        <Tag size={size}>{item}</Tag>
    ))

    return (
        <TagGroup className={styles.tags}>{tags}</TagGroup>
    )
};


/*
ingredients from json
for DOM use:

<Ingredients />

*/
export const Ingredients = ({ ingr }) => {
    return (
        <List>
            {ingr.map((item, index) => (
                <List.Item key={index} index={index}>
                    {item.value}
                </List.Item>
            ))}
        </List>
    );
};

export const MySteps = ({ steps }) => {
    return (
        <Steps current={-1} vertical className={styles.steps}>
            {steps.map((step, index) => (
                <Steps.Item title={'Step ' + (index + 1)} description={step} />
            ))}
        </Steps>
    );
}

export function ingrToString(data) {
    var str = '';

    data.forEach((item, i) => (i === data.length - 1) ? str += item.label + ' ' : str += item.label + ', ');

    return str;
}

export const CardGroup = ({ data, source, footer, onDelete, onUpdate }) => {

    const cards = [];

    if (source === 'edit') {
        data.forEach(item => cards.push(
            <FlexboxGrid.Item style={{ padding: '16px 0 16px' }}>
                <RecipeViewModalEdit data={item} onDelete={onDelete} onUpdate={onUpdate} />
            </FlexboxGrid.Item>
        ))
    } else {
        data.forEach(item => cards.push(
            <FlexboxGrid.Item style={{ padding: '16px 0 16px' }}>
                <RecipeViewModal source={source} footer={footer} data={item} onDelete={onDelete} />
            </FlexboxGrid.Item>
        ))
    }

    return (
        <div>
            <FlexboxGrid justify="space-between">
                {cards}
            </FlexboxGrid>
        </div>
    )
}
