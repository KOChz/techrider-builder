import { createStageAnnotations } from "@/lib/utils/stage-annotations";
import { nanoid } from "nanoid";

const TEMPLATE_PROJECT_ID = "template-project";
const CURRENT_DATE = new Date().toISOString();

export const templates = [
  {
    id: nanoid(),
    templateId: "solo-artist",
    name: "Solo Artist",
    slug: "solo-artist",
    stagePlanConfig: {
      nodes: [
        ...createStageAnnotations(),
        {
          id: nanoid(),
          data: {
            kind: "mic-stand",
            label: "Mic Stand",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 0, y: 100 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Floor Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 0, y: 220 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "synth-stand",
            label: "Synth/Laptop Stand",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -150, y: 50 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -200, y: 200 },
          dragging: false,
          selected: false,
        },
      ],
      edges: [],
    },
    ioSetupConfig: {
      ioRouting: [],
      channelList: [],
    },
    members: [
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Vocalist",
        role: "Lead Vocal",
        icon: "🎤",
        equipment: [
          {
            name: "Vocal Mic",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Shure SM58", "Sennheiser e935", "Audix OM3"],
            },
          },
          {
            name: "Mic Stand",
            quantity: "1",
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
          {
            name: "In-Ear System",
            quantity: "1",
          },
          {
            name: "Synth Stand",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Nord Stage", "Roland RD-2000", "Yamaha CP88"],
            },
          },
          {
            name: "Power Strip",
            quantity: "1",
            examples: {
              title: "Requirements:",
              items: ["220V"],
            },
          },
        ],
        sortOrder: 0,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
    ],
    isPublic: false,
    notes: "",
    contactInfo: "",
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    templateId: "2-piece-band",
    id: nanoid(),
    name: "2 Piece Band",
    slug: "2-piece-band",
    stagePlanConfig: {
      nodes: [
        ...createStageAnnotations(),
        {
          id: nanoid(),
          data: {
            kind: "drumkit",
            label: "Drumkit",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -150, y: -150 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "amp",
            label: "Guitar Amp",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 200, y: -100 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "mic-stand",
            label: "Mic Stand",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 100, y: 150 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 150, y: 250 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 270,
          },
          type: "equipment",
          position: { x: 50, y: -100 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -280, y: 180 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 250, y: 150 },
          dragging: false,
          selected: false,
        },
      ],
      edges: [],
    },
    ioSetupConfig: {
      ioRouting: [],
      channelList: [],
    },
    members: [
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Drums",
        role: "Drums",
        icon: "🥁",
        equipment: [
          {
            name: "Bass Drum",
            quantity: "1",
          },
          {
            name: "Snare Drum",
            quantity: "1",
          },
          {
            name: 'High Tom 12"',
            quantity: "1",
          },
          {
            name: "Floor Tom",
            quantity: "1",
          },
          {
            name: "Drum Carpet",
            quantity: "1",
          },
          {
            name: "In-Ear System",
            quantity: "1",
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
        ],
        sortOrder: 0,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Voc/Guitar",
        role: "Vocal/Guitar",
        icon: "🎸",
        equipment: [
          {
            name: "Guitar Amp",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Roland Jazz Chorus", "Marshall", "Fender"],
            },
          },
          {
            name: "Vocal Mic",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Shure SM58", "Audix OM3"],
            },
          },
          {
            name: "Mic Stand",
            quantity: "1",
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
          {
            name: "In-Ear System",
            quantity: "1",
          },
          {
            name: "Power Strip",
            quantity: "1",
            examples: {
              title: "Requirements:",
              items: ["220V"],
            },
          },
          {
            name: "6.3mm Jack Cable",
            quantity: "2",
            examples: {
              title: "Examples:",
              items: ["Klotz", "Fender", "Minimum 6m each"],
            },
          },
          {
            name: "Guitar Stand",
            quantity: "1",
          },
        ],
        sortOrder: 1,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
    ],
    isPublic: false,
    notes: "",
    contactInfo: "",
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    templateId: "3-piece-band",
    id: nanoid(),
    name: "3 Piece Band",
    slug: "3-piece-band",
    stagePlanConfig: {
      nodes: [
        ...createStageAnnotations(),
        {
          id: nanoid(),
          data: {
            kind: "drumkit",
            label: "Drumkit",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -40, y: -200 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "amp",
            label: "Guitar Amp",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 230, y: -140 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "amp",
            label: "Bass Amp",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -220, y: -130 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -210, y: 240 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 270, y: 240 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 40, y: 310 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 270,
          },
          type: "equipment",
          position: { x: 130, y: -140 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "mic-stand",
            label: "Mic Stand",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 50, y: 160 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -340, y: 200 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -60, y: 230 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 300, y: 180 },
          dragging: false,
          selected: false,
        },
      ],
      //   edges: [
      //     {
      //       id: nanoid(),
      //       data: {},
      //       type: "measure",
      //       source: "drumkit-1",
      //       target: "monitor-3",
      //     },
      //     {
      //       id: nanoid(),
      //       data: {},
      //       type: "measure",
      //       source: "power-1",
      //       target: "power-3",
      //     },
      //   ],
    },
    ioSetupConfig: {
      ioRouting: [],
      channelList: [],
    },
    members: [
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Drums",
        role: "Drums",
        icon: "🥁",
        equipment: [
          {
            name: "Bass Drum",
            quantity: "1",
          },
          {
            name: "Snare Drum",
            quantity: "1",
          },
          {
            name: 'High Tom 12"',
            quantity: "1",
          },
          {
            name: 'Mid Tom 14"',
            quantity: "1",
          },
          {
            name: "Floor Tom",
            quantity: "1",
          },
          {
            name: "Drum Carpet",
            quantity: "1",
          },
          {
            name: "In-Ear System",
            quantity: "1",
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
        ],
        sortOrder: 0,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Voc/Guitar",
        role: "Vocal/Guitar",
        icon: "🎤",
        equipment: [
          {
            name: "Guitar Amp",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Roland Jazz Chorus", "Marshall", "Minimum 50W"],
            },
          },
          {
            name: "Vocal Mic",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Shure SM58", "Audix OM3+"],
            },
          },
          {
            name: "Mic Stand",
            quantity: "1",
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
          {
            name: "In-Ear System",
            quantity: "1",
          },
          {
            name: "Power Strip",
            quantity: "1",
            examples: {
              title: "Requirements:",
              items: ["220V"],
            },
          },
          {
            name: "6.3mm Jack Cable",
            quantity: "2",
            examples: {
              title: "Examples:",
              items: ["Klotz", "Fender", "Minimum 6m each"],
            },
          },
          {
            name: "Guitar Stand",
            quantity: "1",
          },
        ],
        sortOrder: 1,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Bass",
        role: "Bass",
        icon: "🎸",
        equipment: [
          {
            name: "Bass Amp",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Ampeg", "Orange", "Darkglass", "Minimum 300W"],
            },
          },
          {
            name: "6.3mm Jack Cable",
            quantity: "2",
            examples: {
              title: "Examples:",
              items: ["Klotz", "Fender", "Minimum 6m each"],
            },
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
          {
            name: "Power Strip",
            quantity: "1",
            examples: {
              title: "Requirements:",
              items: ["220V"],
            },
          },
        ],
        sortOrder: 2,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
    ],
    isPublic: false,
    notes: "",
    contactInfo: "",
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    templateId: "4-piece-band",
    id: nanoid(),
    name: "4 Piece Band",
    slug: "4-piece-band",
    stagePlanConfig: {
      nodes: [
        ...createStageAnnotations(),
        {
          id: nanoid(),
          data: {
            kind: "drumkit",
            label: "Drumkit",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -40, y: -200 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "amp",
            label: "Guitar Amp",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 230, y: -140 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "amp",
            label: "Guitar Amp",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 330, y: -140 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "amp",
            label: "Bass Amp",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -220, y: -130 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -210, y: 240 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 270, y: 240 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 40, y: 310 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "Monitor",
            rotation: 270,
          },
          type: "equipment",
          position: { x: 130, y: -140 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "mic-stand",
            label: "Mic Stand",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 50, y: 160 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -340, y: 200 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -60, y: 230 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 300, y: 180 },
          dragging: false,
          selected: false,
        },
      ],
      //   edges: [
      //     {
      //       id: nanoid(),
      //       data: {},
      //       type: "measure",
      //       source: "drumkit-1",
      //       target: "monitor-3",
      //     },
      //     {
      //       id: nanoid(),
      //       data: {},
      //       type: "measure",
      //       source: "power-1",
      //       target: "power-3",
      //     },
      //   ],
    },
    ioSetupConfig: {
      ioRouting: [],
      channelList: [],
    },
    members: [
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Drums",
        role: "Drums",
        icon: "🥁",
        equipment: [
          {
            name: "Bass Drum",
            quantity: "1",
          },
          {
            name: "Snare Drum",
            quantity: "1",
          },
          {
            name: 'High Tom 12"',
            quantity: "1",
          },
          {
            name: 'Mid Tom 14"',
            quantity: "1",
          },
          {
            name: "Floor Tom",
            quantity: "1",
          },
          {
            name: "Drum Carpet",
            quantity: "1",
          },
          {
            name: "In-Ear System",
            quantity: "1",
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
        ],
        sortOrder: 0,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Voc/Guitar",
        role: "Vocal/Guitar",
        icon: "🎤",
        equipment: [
          {
            name: "Guitar Amp",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Roland Jazz Chorus", "Marshall", "Minimum 50W"],
            },
          },
          {
            name: "Vocal Mic",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Shure SM58", "Audix OM3+"],
            },
          },
          {
            name: "Mic Stand",
            quantity: "1",
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
          {
            name: "In-Ear System",
            quantity: "1",
          },
          {
            name: "Power Strip",
            quantity: "1",
            examples: {
              title: "Requirements:",
              items: ["220V"],
            },
          },
          {
            name: "6.3mm Jack Cable",
            quantity: "2",
            examples: {
              title: "Examples:",
              items: ["Klotz", "Fender", "Minimum 6m each"],
            },
          },
          {
            name: "Guitar Stand",
            quantity: "1",
          },
        ],
        sortOrder: 1,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Bass",
        role: "Bass",
        icon: "🎸",
        equipment: [
          {
            name: "Bass Amp",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: ["Ampeg", "Orange", "Darkglass", "Minimum 300W"],
            },
          },
          {
            name: "6.3mm Jack Cable",
            quantity: "2",
            examples: {
              title: "Examples:",
              items: ["Klotz", "Fender", "Minimum 6m each"],
            },
          },
          {
            name: "Floor Monitor",
            quantity: "1",
          },
          {
            name: "Power Strip",
            quantity: "1",
            examples: {
              title: "Requirements:",
              items: ["220V"],
            },
          },
        ],
        sortOrder: 2,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "Guitar",
        role: "Guitar",
        icon: "🎸",
        equipment: [
          {
            name: "Guitar Amp",
            quantity: "1",
            examples: {
              title: "Requirements:",
              items: ["Minimum 300W"],
            },
          },
          {
            name: "6.3mm Jack Cable",
            quantity: "2",
            examples: {
              title: "Examples:",
              items: ["Klotz", "Fender", "Minimum 6m each"],
            },
          },
          {
            name: "Power Strip",
            quantity: "1",
            examples: {
              title: "Requirements:",
              items: ["220V"],
            },
          },
        ],
        sortOrder: 3,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
    ],
    isPublic: false,
    notes: "",
    contactInfo: "",
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
  {
    templateId: "dj-setup",
    id: nanoid(),
    name: "DJ Setup",
    slug: "dj-setup",
    stagePlanConfig: {
      nodes: [
        ...createStageAnnotations(),
        {
          id: nanoid(),
          data: {
            kind: "dj-controller",
            label: "DJ Controller",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -50, y: 0 },
          dragging: false,
          selected: false,
        },
        // {
        //   id: nanoid(),
        //   data: {
        //     kind: "laptop",
        //     label: "Laptop",
        //     rotation: 0,
        //   },
        //   type: "equipment",
        //   position: { x: -150, y: 0 },
        //   dragging: false,
        //   selected: false,
        // },
        {
          id: nanoid(),
          data: {
            kind: "speaker",
            label: "Speaker L",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -300, y: 150 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "speaker",
            label: "Speaker R",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 200, y: 150 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "monitor",
            label: "DJ Monitor",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -100, y: 120 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: -250, y: -80 },
          dragging: false,
          selected: false,
        },
        {
          id: nanoid(),
          data: {
            kind: "power-extension",
            label: "Power Strip 220V",
            rotation: 0,
          },
          type: "equipment",
          position: { x: 150, y: -80 },
          dragging: false,
          selected: false,
        },
      ],
      edges: [],
    },
    ioSetupConfig: {
      ioRouting: [],
      channelList: [],
    },
    members: [
      {
        id: nanoid(),
        projectId: TEMPLATE_PROJECT_ID,
        name: "DJ",
        role: "DJ",
        icon: "🎧",
        equipment: [
          {
            name: "Synth/Laptop Stand",
            quantity: "1",
          },

          {
            name: "DJ Headphones",
            quantity: "1",
            examples: {
              title: "Examples:",
              items: [
                "Sennheiser HD 25",
                "Pioneer HDJ-X10",
                "Audio-Technica ATH-M50x",
              ],
            },
          },
          {
            name: "Active Speakers",
            quantity: "2",
            examples: {
              title: "Examples:",
              items: ["QSC K12.2", "JBL EON615", "Minimum 1000W each"],
            },
          },
          {
            name: "DJ Monitor",
            quantity: "1",
          },
          {
            name: "XLR Cables",
            quantity: "2",
            examples: {
              title: "Requirements:",
              items: ["Minimum 10m each"],
            },
          },
          {
            name: "Power Strips",
            quantity: "2",
            examples: {
              title: "Requirements:",
              items: ["220V with surge protection"],
            },
          },
          {
            name: "RCA Cables",
            quantity: "2",
            examples: {
              title: "Requirements:",
              items: ["Minimum 3m each"],
            },
          },
        ],
        sortOrder: 0,
        createdAt: CURRENT_DATE,
        updatedAt: CURRENT_DATE,
      },
    ],
    isPublic: false,
    notes: "",
    contactInfo: "",
    createdAt: CURRENT_DATE,
    updatedAt: CURRENT_DATE,
  },
];
