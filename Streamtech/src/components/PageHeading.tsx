import Icon from "./Icon";

interface PageHeadingProps {
  title: string;
  icon: "film" | "tasks" | "mail";
}

function PageHeading({ title, icon }: PageHeadingProps) {
  return (
    <div className="page-heading d-flex align-items-center gap-3 mb-4 pb-3">
      <span className="page-heading-icon">
        <Icon name={icon} />
      </span>
      <h1 className="h2 mb-0 fw-bold">{title}</h1>
    </div>
  );
}

export default PageHeading;
