import { useState } from 'react'
import { FilePane } from './FilePane'
import { fileRoot } from './files'
import { when } from './utils'

export function ManifestEditor () {

    // The manifest we are creating / editing
    const [manifest, setManifest] = useState({})

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
                // TODO: Add more fields here
                <div>
                    <label>Hidden</label>
                    <input checked={activeNode.hidden} type="checkbox" onChange={(e) => setActiveNode({ ...activeNode, hidden: e.target.checked })} />
                </div>
            ))}
        </>
    );
}