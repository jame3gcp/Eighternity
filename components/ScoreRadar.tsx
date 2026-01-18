import { cn } from "@/lib/utils";

export const ElementBarChart = ({ elements }: { elements: { wood: number, fire: number, earth: number, metal: number, water: number } }) => {
  const data = [
    { label: "목 (Wood)", value: elements.wood, color: "bg-element-wood", track: "bg-element-wood/10", text: "text-element-wood" },
    { label: "화 (Fire)", value: elements.fire, color: "bg-element-fire", track: "bg-element-fire/10", text: "text-element-fire" },
    { label: "토 (Earth)", value: elements.earth, color: "bg-element-earth", track: "bg-element-earth/10", text: "text-element-earth" },
    { label: "금 (Metal)", value: elements.metal, color: "bg-element-metal", track: "bg-element-metal/10", text: "text-element-metal" },
    { label: "수 (Water)", value: elements.water, color: "bg-element-water", track: "bg-element-water/10", text: "text-element-water" },
  ];

  return (
    <div className="space-y-6">
      {data.map((item, i) => (
        <div key={item.label} className="group animate-enter" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex justify-between items-end mb-2.5">
            <span className={cn("text-[10px] font-black uppercase tracking-widest", item.text)}>{item.label}</span>
            <span className="text-sm font-black text-slate-900">{item.value}%</span>
          </div>
          <div className={cn("w-full h-3 rounded-full overflow-hidden shadow-inner", item.track)}>
            <div
              className={cn("h-full rounded-full transition-all duration-1000 ease-out relative", item.color)}
              style={{ width: `${item.value}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
