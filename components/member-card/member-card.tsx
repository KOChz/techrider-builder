import { TProjectMember } from "@/db/schema";

export type TEquipmentExample = {
  title: string;
  items: string[];
};

export type TEquipmentItem = {
  name: string;
  quantity?: string;
  examples?: TEquipmentExample;
};

export type TBandMember = {
  id: string;
  name: string;
  icon: string;
  role: string;
  equipment: TEquipmentItem[];
};

interface IMemberCardProps {
  member: TProjectMember;
}

export function MemberCard({ member }: IMemberCardProps) {
  return (
    <div className="member-card cursor-pointer" id={member.name}>
      <div className="member-header">
        <span className="member-icon">{member.icon}</span>
        <div className="member-info">
          <h3>{member.name}</h3>
          <p className="member-role">{member.role}</p>
        </div>
      </div>
      <ul className="equipment-list">
        {member.equipment.map((item, index) =>
          item.examples ? (
            <details key={index} className="equipment-item">
              <summary>
                <span>
                  {item.name}
                  {item.quantity && (
                    <span className="quantity"> {item.quantity}</span>
                  )}
                </span>
              </summary>
              <div className="examples">
                <p className="examples-title">{item.examples.title}</p>
                <ul className="examples-list">
                  {item.examples.items.map((example, exIndex) => (
                    <li key={exIndex}>{example}</li>
                  ))}
                </ul>
              </div>
            </details>
          ) : (
            <li key={index} className="equipment-simple">
              <span>
                {item.name}
                {item.quantity && (
                  <span className="quantity"> {item.quantity}</span>
                )}
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
