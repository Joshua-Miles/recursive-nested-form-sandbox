import { useState } from 'react'
import { FilePane } from './FilePane'
import { fileRoot } from './files'
import { when } from './utils'
import { Checkbox, Container, AppBar, IconButton, Toolbar, Badge, Breadcrumbs, Link, Typography, Input, Button, FormControl, InputLabel, Select, MenuItem, LinearProgress, List, ListItem, ListItemText } from '@material-ui/core'


export function ManifestEditor() {

    // The manifest we are creating / editing
    const [manifest, setManifest] = useState({})

    window.manifest = manifest

    // An array of property names leading to the node which is active
    //  this is the node whose details we want to display
    const [activeNodePath, setActiveNodePath] = useState(null)

    // This retrieves the active node using it's path
    const activeNode = activeNodePath === null ? null : activeNodePath.reduce((activeNode, pathSegment) => activeNode[pathSegment], manifest)

    // This updates the active node using it's path
    const setActiveNode = newNodeValues => {
        let cursor = manifest
        for (let pathSegment of activeNodePath) {
            cursor[pathSegment] = { ...cursor[pathSegment] }
            cursor = cursor[pathSegment]
        }
        Object.assign(cursor, newNodeValues)
        setManifest({ ...manifest })
    }




    //manifest editor input form:

    //manifest editor add form
    const addVariableToActiveNode = (e) => {
        e.preventDefault()



        //replace activeNOde with new ActiveNode with previous activeNodes and setting variables ..spreading/copying over all of the origianl variables and adding new variables at the end
        setActiveNode({
            ...activeNode,
            variables: [
                ...activeNode.variables,
                {
                    key: '',
                    value: ''
                }
            ]
        })
    }


    // function addVariable() {
    //     // activeNode.variables.push({
    //     //     key: '',
    //     //     value: ''
    //     // })
    //     setActiveNode({
    //         ...activeNode,
    //         variables: [
    //             ...activeNode.variables,
    //             {
    //                 key: '',
    //                 value: ''
    //             }
    //         ]
    //     })
    // }

    function setVariableKey(selectedVariable, key) {
        setActiveNode({
            ...activeNode,
            //💩💩💩💩 can you break down the syntax below again? My concern is how a new nodePath/new activeNode is added and tracked..
            variables: activeNode.variables.map(variable => {
                //💩💩💩 how would you not have a the selectedVariable?
                if (variable === selectedVariable) {
                    return { ...variable, key: key }
                } else {
                    return variable
                }
            })
        })
    }

    function setVariableValue(selectedVariable, value) {
        setActiveNode({
            ...activeNode,
            variables: activeNode.variables.map(variable => {
                if (variable === selectedVariable) {
                    return { ...variable, value: value }
                } else {
                    return variable
                }
            })
        })
    }

    //states set for form:
    //state of the place your're at and ...spread the rest of where you were (also same for the path)
    // const [manifestForm ]

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <FilePane
                    files={fileRoot}
                    manifest={manifest}
                    activeNode={activeNode}
                    onChange={setManifest}
                    onSelectActiveNode={setActiveNodePath}
                />
            </div>

            {/* <button onClick={add}>Click here to add an asset the current level:</button> */}

            {when(activeNode !== null, () => (
                // TODO: Add more fields here
                <div>
                    {/* <h2>Updating The Manifest</h2> */}

                    <Typography variant="h4" style={{ margin: 10 }}>Updating The Manifest</Typography>

                    {/* Mapping over variables and adding a plus button on the bottom to setState to the variable arr   
                        setting object with key & vaalue  
                    */}

                    {/* <label>Hidden</label>
                    <input checked={activeNode.hidden} type="checkbox" onChange={(e) => setActiveNode({ ...activeNode, hidden: e.target.checked })} /> */}

                    <Typography variant="h5" >Path to the selected manifest asset:</Typography>

                    <p>{activeNodePath.toString()}</p>
                    <br />
                    <Container>
                        <FormControl style={{ width: '15vw', margin: 10 }}>
                            <InputLabel labelId="typeOfAsset">
                                Type of Asset
                                </InputLabel>
                            <Select
                                id="typeOfAsset"
                                value={activeNode.type}
                                onChange={(e) => setActiveNode({ ...activeNode, type: e.target.value })}
                            >
                                <MenuItem value="lesson">Lesson</MenuItem>
                                <MenuItem value="html">HTML</MenuItem>
                                <MenuItem value="ppt">Powerpoint</MenuItem>
                                <MenuItem value="course">Course</MenuItem>
                                <MenuItem value="topic">Topic</MenuItem>
                            </Select>
                        </FormControl>
                        {/* <FormControl style={{ width: '15vw', margin: 10 }}>
                            <InputLabel labelId="nameOfAsset">Name of Asset</InputLabel>
                            <Input type="text" onChange={(e) => setVariableValue({ ...activeNode, value: e.target.value })} id="nameOfAsset" />
                        </FormControl> */}

                        <FormControl style={{ width: '15vw', margin: 10 }}>
                            <InputLabel labelId="hidden">Hidden:</InputLabel>
                            <Checkbox checked={activeNode.hidden} id="hidden" type="checkbox" onChange={(e) => setActiveNode({ ...activeNode, hidden: e.target.checked })} />
                        </FormControl>

                        <Button onClick={addVariableToActiveNode} variant="contained">Add</Button>

                        {
                            activeNode.variables.map(variable => (
                                <div>
                                    <FormControl style={{ width: '15vw', margin: 10 }}>
                                        <InputLabel labelId="nameOfKey">Key</InputLabel>
                                        <Input type="text" onChange={(e) => setVariableKey(variable, e.target.value)} id="nameOfKey" />
                                    </FormControl>
                                    <FormControl style={{ width: '15vw', margin: 10 }}>
                                        <InputLabel labelId="nameOfValue">Value</InputLabel>
                                        <Input type="text" onChange={(e) => setVariableValue(variable, e.target.value)} id="nameOfValue" />
                                    </FormControl>
                                </div>
                            )

                            )
                        }
                        {/* <select onChange={(e) => setVariableKey({ ...activeNode, key: e.target.key })} id="manifest" name="manifest">
                                <option value="lesson">Lesson</option>
                                <option value="html">HTML</option>
                                <option value="ppt">Powerpoint</option>
                            </select> */}
                    </Container>

                    {/* <div>
                            <label>Name of Asset:</label>
                            <input type="text" onChange={(e) => setVariableValue({ ...activeNode, value: e.target.value })} />
                        </div>
                        <div>
                            <label>Hidden</label>
                            <input checked={activeNode.hidden} type="checkbox" onChange={(e) => setActiveNode({ ...activeNode, hidden: e.target.checked })} />
                        </div>
                        <div>
                            <input type="submit"></input>
                        </div> */}
                </div>
            ))}
        </>
    );
}