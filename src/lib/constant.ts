import {
  LogIn,
  FileText,
  Bell,
  Lightbulb,
  Calculator,
  Zap,
} from "lucide-react";

export const exploreWorlds = [
  [
    {
      id: "world-1",
      imgUrl: "assets/azerIshiq-F1.png",
      title: "Səməd Vurğun Street, 53/1",
      description:
        "This branch manages electricity distribution and maintenance services within the Nəsimi district, ensuring reliable power supply to residential and commercial areas.",
    },
    {
      id: "world-2",
      imgUrl: "assets/azerIshiq-F2.jpg",
      title: "Bakmil Branch",
      description:
        "Serving the Khazar district, this department oversees the supply and sale of electricity, addressing consumer needs and maintaining the local power infrastructure",
    },
    {
      id: "world-3",
      imgUrl: "assets/azerIsiq-F3.jpg",
      title: "Ganjlik Branch",
      description:
        "Responsible for electricity distribution in the Binagadi area, this branch ensures consistent power delivery and handles maintenance operations.",
    },
    {
      id: "world-4",
      imgUrl: "assets/azerIsiq-F4.jpg",
      title: "Binagadi Branch",
      description:
        "This branch caters to the Sabail district, managing electricity services and infrastructure to support both residential and business communities.",
    },
    {
      id: "world-5",
      imgUrl: "assets/azerIshiq-F5.jpg",
      title: "Yasamal Branch",
      description:
        "Serving the Yasamal district, this branch focuses on delivering reliable electricity supply and addressing customer service inquiries.",
    },
  ],
  [
    {
      id: "world-1",
      imgUrl: "assets/azerIshiq-F1.png",
      title: "Səməd Vurğun küçəsi, 53/1",
      description:
        "Bu filial Nəsimi rayonu ərazisində elektrik enerjisinin paylanması və texniki xidmətlərini idarə edir, yaşayış və ticarət sahələrinə etibarlı enerji təchizatını təmin edir.",
    },
    {
      id: "world-2",
      imgUrl: "assets/azerIshiq-F2.jpg",
      title: "Bakmil Filialı",
      description:
        "Xəzər rayonuna xidmət edən bu şöbə elektrik enerjisinin satışı və təchizatını nəzarətdə saxlayır, istehlakçıların ehtiyaclarını qarşılayır və yerli enerji infrastrukturunun saxlanmasını təmin edir.",
    },
    {
      id: "world-3",
      imgUrl: "assets/azerIsiq-F3.jpg",
      title: "Gənclik Filialı",
      description:
        "Binəqədi rayonunda elektrik enerjisinin paylanmasına cavabdeh olan bu filial sabit enerji təchizatını təmin edir və texniki xidmət əməliyyatlarını həyata keçirir.",
    },
    {
      id: "world-4",
      imgUrl: "assets/azerIsiq-F4.jpg",
      title: "Binəqədi Filialı",
      description:
        "Bu filial Səbail rayonu üzrə elektrik enerjisi xidmətlərini və infrastrukturunu idarə edir, həm yaşayış, həm də biznes icmalarını dəstəkləyir.",
    },
    {
      id: "world-5",
      imgUrl: "assets/azerIshiq-F5.jpg",
      title: "Yasamal Filialı",
      description:
        "Yasamal rayonuna xidmət edən bu filial, etibarlı elektrik təchizatı təminatına və müştəri xidmətləri sorğularının cavablandırılmasına yönəlmişdir.",
    },
  ],
];

export const startingFeatures = [
  "Managing electricity distribution networks across Azerbaijan",
  "Introducing digital services for efficient energy consumption",
  "Supporting renewable energy projects for a greener future",
];

export const serviceItems = [
  {
    title: "Şəxsi kabinet",
    description:
      "Şəxsi kabinetiniz vasitəsilə öz sərfiyatlarınızdan, aktlarınızdan, ödənişlərinizdən xəbərdar olun",
    icon: LogIn,
    src: "/login",
  },
  {
    title: "Təklif və şikayətlər",
    description: "Elektron qaydada müraciət etmək üçün klikləyin",
    icon: FileText,
    src: "/feedback",
  },
  {
    title: "E-müraciətin statusu",
    description:
      "Elektron müraciətinizin statusu, mərhələsi haqqında ətraflı məlumat üçün profilinizə nəzər yetirin",
    icon: Bell,
    src: "/login",
  },
  {
    title: "Elektron işıq portalı",
    description:
      '"Azərişıq" ASC tərəfindən göstərilən xidmətlər üçün keçid edin',
    icon: Lightbulb,
    src: "/electricity-portal",
  },
  {
    title: "Qoşulma kalkulyatoru",
    description:
      "Elektrik şəbəkəsinə qoşulma xərclərini təqdim etdiyimiz kalkulyatorla hesablayın",
    icon: Calculator,
    src: "/connection-calculator",
  },
  {
    title: "Elektrik şəbəkəsinə qoşulma",
    description:
      "Elektrik şəbəkəsinə qoşulmaq üçün klikləyin və ilk pəncərədəki təlimatla davam edin",
    icon: Zap,
    src: "/subscriber/add",
  },
];

export const appealTopic = [
  "Şikayyət",
  "Təklif",
  "Qəza",
  "Sayğac quraşdırma",
  "Sms sayğac quraşdırma",
  "Qısa məlumat",
  "Şəbəkəyə qoşulma",
  "Məlumat dəyişikliyi",
  "Onlayn ödəmə müraciəti",
  "Insan qaynaqları",
  "İstismar qaydaları",
  "Digər",
];
export const engAppealTopic = [
  "Complaint",
  "Suggestion",
  "Accident",
  "Meter installation",
  "Smart meter installation",
  "Brief information",
  "Network connection",
  "Information update",
  "Online payment request",
  "Human resources",
  "Operating rules",
  "Other",
];

export const numberPrefix = [
  "+99410",
  "+99412",
  "+99450",
  "+99451",
  "+99455",
  "+99460",
  "+99470",
  "+99477",
  "+99499",
];
