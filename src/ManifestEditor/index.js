import { useState } from 'react'
import { FilePane } from './FilePane'
import { fileRoot } from './files'
import { when } from './utils'
import { Checkbox, Container, Breadcrumbs, Typography, Input, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'


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

    const addVariableToActiveNode = (e) => {
        e.preventDefault()
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


    function setVariableKey(selectedVariable, key) {
        setActiveNode({
            ...activeNode,
            variables: activeNode.variables.map(variable => {
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

            {when(activeNode !== null, () => (
                <div>

                    <Container style={{ marginTop: 30 }}>
                        <Typography variant="h5" >Path to the selected manifest asset:</Typography>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="inherit" href="/getting-started/installation/">
                                {activeNodePath.map((node, index) => {
                                    if (index % 2 === 0) {
                                        return node.toString() + " --> "
                                    }
                                })}
                            </Typography>
                        </Breadcrumbs>
                    </Container>


                    <br />
                    <Container>
                        <FormControl style={{ width: '15vw', margin: 5 }}>
                            <InputLabel labelId="typeOfAsset">
                                Export Asset As:
                            </InputLabel>
                            <Select
                                id="typeOfAsset"
                                value={activeNode.type}
                                onChange={(e) => setActiveNode({ ...activeNode, type: e.target.value })}
                            >
                                <MenuItem value="lesson">Lesson</MenuItem>
                                <MenuItem value="html">HTML</MenuItem>
                                <MenuItem value="ppt">Powerpoint</MenuItem>
                                <MenuItem value="topic">Topic</MenuItem>
                            </Select>
                        </FormControl>


                        <FormControl style={{ width: '30vw' }}>
                            <InputLabel labelId="hidden">Hidden From Learner View:</InputLabel>
                            <Checkbox checked={activeNode.hidden} id="hidden" type="checkbox" onChange={(e) => setActiveNode({ ...activeNode, hidden: e.target.checked })} />
                        </FormControl>

                        <div>
                            <Button size="medium" onClick={addVariableToActiveNode} variant="contained">Add</Button>
                        </div>

                        {
                            activeNode.variables.map(variable => (
                                <div>
                                    <FormControl style={{ width: '15vw', margin: 10 }}>
                                        <InputLabel labelId="nameOfKey">Key</InputLabel>
                                        <Input type="text" value={variable.key} onChange={(e) => setVariableKey(variable, e.target.value)} id="nameOfKey" />
                                    </FormControl>
                                    <FormControl style={{ width: '15vw', margin: 10 }}>
                                        <InputLabel labelId="nameOfValue">Value</InputLabel>
                                        <Input type="text" value={variable.value} onChange={(e) => setVariableValue(variable, e.target.value)} id="nameOfValue" />
                                    </FormControl>
                                </div>
                            ))
                        }
                    </Container>
                </div>
            ))}
        </>
    );
}