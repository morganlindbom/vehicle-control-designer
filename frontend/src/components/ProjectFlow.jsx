import { useMemo } from "react";
import ReactFlow, { Background, Controls, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import "../styles/projectDetails.css";

const categoryStyles = {
  input: "project-flow-node--input",
  sensor: "project-flow-node--sensor",
  controller: "project-flow-node--controller",
  output: "project-flow-node--output",
  hardware: "project-flow-node--hardware",
};

function FlowNode({ data }) {
  return (
    <div
      className={`project-flow-node ${data.className || "project-flow-node--default"}`}
    >
      <Handle type="target" position={Position.Left} />
      <div className="project-flow-node__label">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function ProjectFlow({ components, connections, templates }) {
  const { nodes, edges } = useMemo(() => {
    const categoryOrder = [
      "input",
      "sensor",
      "controller",
      "output",
      "hardware",
    ];
    const componentsByCategory = categoryOrder.reduce((groups, category) => {
      groups[category] = [];
      return groups;
    }, {});

    const templateById = templates.reduce((lookup, template) => {
      lookup[template.id] = template;
      return lookup;
    }, {});

    components.forEach((component) => {
      const template = templateById[component.templateId];
      const category = template?.category || "controller";
      const bucket = componentsByCategory[category] ? category : "controller";
      componentsByCategory[bucket].push({
        ...component,
        category: bucket,
      });
    });

    const categoryPositions = {
      input: 100,
      sensor: 100,
      controller: 500,
      output: 900,
      hardware: 1300,
    };

    const mappedNodes = categoryOrder.flatMap((category) =>
      (componentsByCategory[category] || []).map((component, index) => ({
        id: component.id,
        data: {
          label: component.name,
          className: categoryStyles[category] || "project-flow-node--default",
        },
        position: {
          x: categoryPositions[category],
          y: index * 150,
        },
        type: "flowNode",
      })),
    );

    const mappedEdges = connections.map((connection) => ({
      id: connection.id,
      source: connection.from,
      target: connection.to,
    }));

    return {
      nodes: mappedNodes,
      edges: mappedEdges,
    };
  }, [components, connections, templates]);

  return (
    <div
      className="project-architecture-shell"
      style={{ height: 460, width: "100%" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodeTypes={{ flowNode: FlowNode }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default ProjectFlow;
