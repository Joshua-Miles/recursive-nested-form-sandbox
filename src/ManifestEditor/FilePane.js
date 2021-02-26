import { useState } from 'react'
import { Select } from './Select'
import { createManifestNode } from './createManifestNode'
import { when } from './utils'

export function FilePane({ files, manifest, activeNode, onChange, onSelectActiveNode }) {

  // The nodes inside this section of the manifest
  let nodeChildNames = Object.keys(manifest)

  // The nodes inside this section of the whole file system
  //  * filtering out the files already in the manifest
  let fileNames = Object.keys(files).filter(name => !nodeChildNames.includes(name))

  // Whether or not to show the select box
  let [isAddingChild, setIsAddingChild] = useState(false)

  // The name of the child node currently selected
  let [selectedChildNode, setSelectedChildNode] = useState(null)

  // When the user selects a child from the select box
  function handleAdd(childName) {

    // if the child already has a manifest, select it.
    //  otherwise, create a new manifest object
    let manifestForChild;
    if (manifest[childName]) {
      manifestForChild = manifest[childName]
    } else {
      manifestForChild = createManifestNode()
    }

    // update the manifest with the new child
    onChange({ ...manifest, [childName]: manifestForChild })

    // automatically select the new child
    setSelectedChildNode(childName)

    // set the node as active (this will make it's detail view appear, with the hidden checkbox and such)
    onSelectActiveNode([childName])

    // hide the select box
    setIsAddingChild(false)
  }

  // When the user clicks on a child in the list
  function handleSelect(childName) {
    // select the clicked child
    setSelectedChildNode(childName)

    // set the node as active (this will make it's detail view appear, with the hidden checkbox and such)
    onSelectActiveNode([childName])

    // hide the select box
    setIsAddingChild(false)
  }

  return (
    <>
      <div>
        <ul>
          {nodeChildNames.map(childName => (
            <li
              key={childName}
              style={{
                fontWeight: selectedChildNode === childName ? 'bold' : 'normal',
                border: activeNode === manifest[childName] ? '1px solid gold' : undefined
              }}
              onClick={() => handleSelect(childName)}
            >
              {childName}
            </li>
          ))}
          {when(isAddingChild, () => (
            <Select options={fileNames} onSelect={handleAdd} />
          ))}
          {when(fileNames.length > 0, () => (
            <button onClick={() => setIsAddingChild(true)}>
              +
            </button>
          ))}
        </ul>
      </div>
      {when(selectedChildNode !== null && files[selectedChildNode] !== null, () => (
        // Render a file panel to the right for the selected child
        <FilePane
          key={selectedChildNode}
          files={files[selectedChildNode]}
          manifest={manifest[selectedChildNode].children}
          activeNode={activeNode}
          onChange={childManifests => {
            onChange({
              ...manifest,
              [selectedChildNode]: {
                ...manifest[selectedChildNode],
                children: childManifests
              }
            })
          }}
          onSelectActiveNode={filePath => {
            onSelectActiveNode([selectedChildNode, 'children', ...filePath])
          }}
        />
      ))}
    </>
  )
}