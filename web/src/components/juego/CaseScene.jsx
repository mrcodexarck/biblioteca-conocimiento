import React from 'react';

export default function CaseScene({ scene, discoveredItems, onDiscover }) {
  const handleClick = (hotspot) => {
    if (discoveredItems.includes(hotspot.itemId)) return;
    onDiscover(hotspot.itemId);
  };

  return (
    <div className="case-scene">
      <img
        src={scene.image}
        alt={scene.name}
        className="case-scene__image"
        draggable={false}
      />

      {scene.hotspots.map((h) => {
        const found = discoveredItems.includes(h.itemId);
        if (found) return null;
        return (
          <button
            key={h.id}
            type="button"
            className="case-scene__hotspot"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => handleClick(h)}
            aria-label="Buscar pista"
          />
        );
      })}
    </div>
  );
}