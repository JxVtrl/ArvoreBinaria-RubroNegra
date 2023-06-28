import React, { ReactElement, useState } from "react"

import "./styles.css"

interface Node {
  value: number
  left: Node | null
  right: Node | null
  color: string
  parent: Node | null
  grandparent: Node | null
  uncle: Node | null
}

interface TreeNodeProps {
  node: Node
}

// Função para criar um nó da árvore
const createNode = ({
  color,
  left,
  right,
  value,
  grandparent,
  parent,
  uncle,
}: Node): Node => ({
  value,
  left,
  right,
  color,
  grandparent,
  parent,
  uncle,
})

// Componente para representar um nó da árvore na visualização
const TreeNode = ({ node }: TreeNodeProps): ReactElement => {
  const { color, value } = node

  return (
    <div
      className="node"
      style={{
        backgroundColor: color,
      }}
    >
      {value}
    </div>
  )
}

// Componente da árvore binária rubro-negra
const RedBlackTree = (): ReactElement => {
  const [root, setRoot] = useState<Node | null>(null)

  // Função para inserir um nó na árvore
  const insert = (value: number): void => {
    const newNode = createNode({
      color: "red",
      value,
      grandparent: null,
      left: null,
      parent: null,
      right: null,
      uncle: null,
    })

    if (root === null) {
      newNode.color = "black" // Define a cor da raiz como preta
      setRoot(newNode)
    } else {
      setRoot(insertNode(root, newNode))
      setRoot(rebalanceTree(root)) // Rebalanceia a árvore após a inserção
    }
  }

  // Função para inserir um nó de forma recursiva
  const insertNode = (currentNode: Node | null, newNode: Node): Node => {
    if (currentNode === null) return newNode

    if (newNode.value < currentNode.value) {
      return createNode({
        value: currentNode.value,
        left: insertNode(currentNode.left ?? null, newNode),
        right: currentNode.right,
        color: currentNode.color,
        grandparent: currentNode.grandparent,
        parent: currentNode.parent,
        uncle: currentNode.uncle,
      })
    } else {
      return createNode({
        value: currentNode.value,
        left: currentNode.left,
        right: insertNode(currentNode.right ?? null, newNode),
        color: currentNode.color,
        grandparent: currentNode.grandparent,
        parent: currentNode.parent,
        uncle: currentNode.uncle,
      })
    }
  }

  const rebalanceTree = (node: Node): Node | null => {
    if (node === null) return null

    // Caso 1: O nó atual é a raiz da árvore
    if (node === root) {
      node.color = "black"
      return node
    }

    // Caso 2: O pai do nó é preto, então a árvore está balanceada
    if (node.color === "red" && node.parent?.color === "black") {
      return node
    }

    // Caso 3: O pai e o tio do nó são vermelhos
    if (
      node.parent?.color === "red" &&
      node.uncle?.color === "red" &&
      node.grandparent?.color !== "red"
    ) {
      node.parent.color = "black"
      node.uncle.color = "black"
      if (node.grandparent !== null) {
        node.grandparent.color = "red"
        return rebalanceTree(node.grandparent)
      } else {
        return node
      }
    }

    // Caso 4: O pai é vermelho e o tio é preto ou inexistente
    if (
      node.parent?.color === "red" &&
      (node.uncle?.color === "black" || node.uncle === null)
    ) {
      // Caso 4a: Nó é filho direito do pai e o pai é filho esquerdo do avô
      if (
        node === node.parent.right &&
        node.grandparent &&
        node.parent === node.grandparent.left
      ) {
        rotateLeft(node.parent)
        node = node.left
      }
      // Caso 4b: Nó é filho esquerdo do pai e o pai é filho direito do avô
      else if (
        node === node.parent.left &&
        node.grandparent &&
        node.parent === node.grandparent.right
      ) {
        rotateRight(node.parent)
        node = node.right
      }

      // Caso 5: O nó é filho esquerdo do pai e o pai é filho esquerdo do avô
      if (
        node.parent &&
        node.grandparent &&
        node === node.parent.left &&
        node.parent === node.grandparent.left
      ) {
        node.parent.color = "black"
        node.grandparent.color = "red"
        rotateRight(node.grandparent)
      }
      // Caso 6: O nó é filho direito do pai e o pai é filho direito do avô
      else if (
        node.parent &&
        node.grandparent &&
        node === node.parent.right &&
        node.parent === node.grandparent.right
      ) {
        node.parent.color = "black"
        node.grandparent.color = "red"
        rotateLeft(node.grandparent)
      }
    }

    return root
  }

  // Função recursiva para percorrer a árvore em pré-ordem
  const preOrderTraversal = (node: Node): ReactElement | null => {
    if (node === null) return null

    return (
      <>
        <TreeNode node={node} />
        {node.left && preOrderTraversal(node.left)}
        {node.right && preOrderTraversal(node.right)}
      </>
    )
  }

  // Função para renderizar a visualização da árvore
  const renderTree = (): ReactElement | null => {
    if (root === null) return null

    return <div className="tree">{preOrderTraversal(root)}</div>
  }

  return (
    <div>
      <h2>Árvore Binária Rubro-Negra</h2>
      {renderTree()}
      <button onClick={() => insert(10)}>Inserir 10</button>
      <button onClick={() => insert(5)}>Inserir 5</button>
      <button onClick={() => insert(15)}>Inserir 15</button>
    </div>
  )
}

export default RedBlackTree
