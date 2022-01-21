import React from 'react'

import {
    Container, Rate, FlexboxGrid, Button, Modal, Message, toaster, Panel, Loader, ButtonToolbar
} from 'rsuite';

import 'rsuite/dist/rsuite.min.css';
import { baseUrl } from '../utils/api';

import HeartIcon from '@rsuite/icons/legacy/Heart';

import { Tags, ingrToString } from './../components/Components'

import * as components from './Components'

import styles from '../css/Card.module.css';

export const RecipeViewModal = ({ data, onDelete, footer, source }) => {

    const [open, setOpen] = React.useState(false);
    const [req, setReq] = React.useState(true);
    const [recipeData, setRecipeData] = React.useState({});

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setReq(true);
        setOpen(false);
        setRecipeData({})
    }

    const messageError = (
        <Message showIcon type="error" >
            Аn error has occured, please try later.
        </Message>
    );

    const messageSuccess = (action) => {
        if (action === "decline") {
            return <Message showIcon type="warning" >
                Recipe was declined.
            </Message>
        } else {
            return <Message showIcon type="success" >
                Recipe was published.
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
                setRecipeData(json)
                setReq(false)
            }

        } catch (error) {
            console.log(error)
        }

    };

    const handleDecline = async () => {

        try {
            const response = await fetch(`${baseUrl}/recipe/${data.id}/decline`, {
                mode: 'cors',
                credentials: 'include',
                method: 'POST'
            })

            if (!response.ok) {
                toaster.push(messageError);
            } else {
                toaster.push(messageSuccess("decline"));
                onDelete(recipeData.id);
                handleClose();
            }

        } catch (error) {
            toaster.push(messageError);
        }
    };

    const handlePublish = async () => {

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
                onDelete(recipeData.id);
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

    const [rateValue, setRateValue] = React.useState(data.rated);
    const rateRecipe = async (value) => {
        setRateValue(value);

        try {
            const response = await fetch(`${baseUrl}/recipe/${data.id}/rate?rating=${value}`, {
                mode: 'cors',
                credentials: 'include',
                method: 'POST'
            })

            if (!response.ok) {
                toaster.push(messageError);
            } else {
                toaster.push(
                    <Message showIcon type="success" >
                        Your rating has been successfully accepted.
                    </Message>
                );
            }

        } catch (error) {
            toaster.push(messageError);
        }

    };

    const [saveRecipeValue, setSaveRecipeValue] = React.useState(data.favourite ? 1 : 0);
    // const [saveRecipeValue, setSaveRecipeValue] = React.useState(false ? 1 : 0);
    const saveRecipe = async (value) => {
        setSaveRecipeValue(value);

        if (value === 0) {
            // delete 
            try {
                const response = await fetch(`${baseUrl}/favourite/${data.id}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: 'DELETE'
                })

                if (!response.ok) {
                    toaster.push(messageError);
                } else {
                    toaster.push(
                        <Message showIcon type="warning" >
                            Recipe was deleted from favourites.
                        </Message>
                    );
                }

            } catch (error) {
                toaster.push(messageError);
            }
        } else {
            // post 

            try {
                const response = await fetch(`${baseUrl}/favourite/${data.id}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: 'post'
                })

                if (!response.ok) {
                    toaster.push(messageError);
                } else {
                    toaster.push(
                        <Message showIcon type="success" >
                            Recipe was saved to favourites.
                        </Message>
                    );
                }

            } catch (error) {
                toaster.push(messageError);
            }

        }
    };

    return (

        <div className="modal-container" >

            <Panel shaded bordered bodyFill className={styles.card} onClick={handleOpen}>
                <img alt="pic" src={data.iconUrl} style={{ objectFit: 'cover' }} height="240" width="360" />
                <Panel header={data.title}>

                    <Tags recipe_tags={data.tags} size="lg" />

                    <p style={{ padding: '12px 0px 0px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Ingredients: {ingrToString(data.ingredients)}</p>

                    {source === 'page' &&
                        <p style={{ padding: '4px 0px 0px' }}>Rating: {data.rating.toFixed(1)}, {data.ratingNums} ratings</p>
                    }

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
                    <Modal.Title>View recipe</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {req ? (
                        <div style={{ textAlign: 'center' }}>
                            <Loader size="md" />
                        </div>
                    ) : (

                        <Container>
                            <FlexboxGrid justify="space-around">
                                <FlexboxGrid.Item colspan={20} align='left'>
                                    <div style={{ padding: '24px 0 24px' }}>

                                        <div style={{ display: 'flex', flexFlow: 'column', gap: '12px' }}>

                                            <components.Tags recipe_tags={recipeData.tags} size="lg" />

                                            {
                                                source === 'page' &&
                                                <div>
                                                    <h2 style={{ display: 'inline-block', marginRight: '25px' }}>{recipeData.title}</h2>
                                                    <Rate style={{ verticalAlign: 'sub' }}
                                                        value={saveRecipeValue}
                                                        character={<HeartIcon />}
                                                        color="red"
                                                        onChange={saveRecipe}
                                                        max={1}
                                                        size='sm'
                                                    />
                                                </div>
                                            }

                                            {source !== 'page' && <h2>{recipeData.title}</h2>}

                                            {source === "page" &&
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Rate onChange={rateRecipe} value={rateValue} size="xs" />
                                                    <p>{recipeData.rating.toFixed(1)}, {recipeData.ratingNums} ratings</p>
                                                </div>
                                            }

                                            {source === "page" &&
                                                <p>By {recipeData.author} | Updated {(new Date(recipeData.updated)).toUTCString()}</p>
                                            }

                                            {source === "modal" &&
                                                <p>By {recipeData.author}</p>
                                            }

                                        </div>
                                    </div>

                                    <div style={{ padding: '0px 0 48px' }}>
                                        <FlexboxGrid justify="space-between">
                                            <FlexboxGrid.Item colspan={7} align='left'>
                                                <h4>Ingredients</h4>
                                                <br />
                                                <components.Ingredients ingr={recipeData.ingredients} />
                                            </FlexboxGrid.Item>

                                            <FlexboxGrid.Item colspan={6}>
                                                <img src={recipeData.iconUrl} alt="pic" style={{ width: '100%' }} />
                                            </FlexboxGrid.Item>

                                            <FlexboxGrid.Item colspan={7} align='left'>
                                                <components.MySteps steps={recipeData.steps} />
                                            </FlexboxGrid.Item>

                                        </FlexboxGrid>
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </Container>

                    )}

                </Modal.Body>

                <Modal.Footer>
                    {
                        {
                            'close':
                                <Button onClick={handleClose} appearance="ghost">
                                    Close
                                </Button>,
                            'delete':
                                <Button color="red" onClick={handleDelete} appearance="ghost">
                                    Delete
                                </Button>,
                            'modal':
                                <ButtonToolbar>
                                    <Button color="red" onClick={handleDecline} appearance="ghost">
                                        Decline
                                    </Button>
                                    <Button color="green" onClick={handlePublish} appearance="ghost">
                                        Accept
                                    </Button>
                                </ButtonToolbar>
                        }[footer]
                    }
                </Modal.Footer>

            </Modal>
        </div >
    );
}