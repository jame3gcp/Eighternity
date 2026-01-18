import { cn } from "@/lib/utils";

export const ElementBarChart = ({ elements }: { elements: { wood: number, fire: number, earth: number, metal: number, water: number } }) => {
  const data = [
    { label: "木", value: elements.wood, color: "bg-element-wood", track: "bg-element-wood/10", text: "text-element-wood" },
    { label: "火", value: elements.fire, color: "bg-element-fire", track: "bg-element-fire/10", text: "text-element-fire" },
    { label: "土", value: elements.earth, color: "bg-element-earth", track: "bg-element-earth/10", text: "text-element-earth" },
    { label: "金", value: elements.metal, color: "bg-element-metal", track: "bg-element-metal/10", text: "text-element-metal" },
    { label: "水", value: elements.water, color: "bg-element-water", track: "bg-element-water/10", text: "text-element-water" },
  ];

  // 전체 합계 계산 (비율 계산용)
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex gap-2">
      {data.map((item, i) => {
        // 비율 계산 (최소 너비 보장)
        const percentage = total > 0 ? item.value / total : 0.2; // 0이면 균등 분배
        const minWidth = item.value > 0 ? `${Math.max(percentage * 100, 8)}%` : '8%'; // 최소 8% 너비
        
        return (
          <div 
            key={item.label} 
            className="group animate-enter text-center flex-1" 
            style={{ 
              animationDelay: `${i * 100}ms`,
              flexBasis: minWidth,
              minWidth: minWidth,
            }}
          >
            <div className="mb-3">
              <span className={cn("text-lg font-black", item.text)}>{item.label}</span>
              <div className="text-xl font-black text-slate-900 mt-1">{item.value}%</div>
            </div>
            <div className={cn("w-full h-32 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-end", item.track)}>
              <div
                className={cn("w-full rounded-t-2xl transition-all duration-1000 ease-out relative", item.color)}
                style={{ height: `${item.value}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
