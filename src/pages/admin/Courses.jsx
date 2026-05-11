// src/pages/admin/Courses.jsx
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import ConfirmModal from "../../components/ConfirmModal";
import MessageModal from "../../components/MessageModal";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  University,
  BookOpen,
  GraduationCap,
  Info,
} from "lucide-react";

const PlusIcon = () => <Plus className="w-5 h-5 mr-2" />;
const EditIcon = () => <Pencil className="w-4 h-4" />;
const TrashIcon = () => <Trash2 className="w-4 h-4" />;

// Componente de select filtrável para os filtros
function FilterableSelect({ options, value, onChange, placeholder }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-64">
      <input
        type="text"
        value={isOpen ? search : value}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-auto shadow-lg">
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-gray-500 text-sm">Nenhum resultado</li>
          ) : (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setSearch(opt);
                  setIsOpen(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm"
              >
                {opt}
              </li>
            ))
          )}
          {value && (
            <li
              onClick={() => {
                onChange("");
                setSearch("");
                setIsOpen(false);
              }}
              className="px-3 py-2 text-gray-500 text-sm cursor-pointer hover:bg-gray-100 border-t"
            >
              Limpar seleção
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function Courses() {
  const [coursesByInstitution, setCoursesByInstitution] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState(() => () => {});
  const [modalProps, setModalProps] = useState({
    title: "Tem certeza?",
    message: "Você deseja realmente continuar?",
  });
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalProps, setMessageModalProps] = useState({
    title: "",
    message: "",
    success: true,
  });

  const [filterInstitution, setFilterInstitution] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const limitPerInstitution = 5;
  const [expandedInstitutions, setExpandedInstitutions] = useState({});
  const toggleExpand = (institutionName) => {
    setExpandedInstitutions((prev) => ({
      ...prev,
      [institutionName]: !prev[institutionName],
    }));
  };

  useEffect(() => {
    fetchCoursesAndGroup();
  }, []);

  const fetchCoursesAndGroup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/courses");
      const fetchedCourses = Array.isArray(res.data) ? res.data : [];

      const grouped = fetchedCourses.reduce((acc, course) => {
        const instName = course.institutions?.name || "Instituição Desconhecida";
        if (!acc[instName])
          acc[instName] = { id: course.institutions?.id, courses: [] };
        acc[instName].courses.push(course);
        return acc;
      }, {});

      setCoursesByInstitution(grouped);
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
      setError("Falha ao carregar cursos. Tente novamente mais tarde.");
      setCoursesByInstitution({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/courses/${courseId}`);
      fetchCoursesAndGroup();
      setMessageModalProps({
        title: "Curso excluído",
        message: "O curso foi excluído com sucesso.",
        success: true,
      });
    } catch (err) {
      console.error("Erro ao excluir curso:", err);
      setMessageModalProps({
        title: "Erro ao excluir",
        message: "Falha ao excluir curso.",
        success: false,
      });
    } finally {
      setIsMessageModalOpen(true);
      setIsLoading(false);
    }
  };

  const confirmarAcao = ({ onConfirm, title, message }) => {
    setModalProps({
      title: title || "Tem certeza?",
      message: message || "Você deseja realmente continuar?",
    });
    setOnConfirmCallback(() => onConfirm);
    setIsModalOpen(true);
  };

  const confirmarCancelamento = (courseId) => {
    confirmarAcao({
      title: "Tem certeza que deseja excluir este curso?",
      message: "Esta ação não pode ser desfeita.",
      onConfirm: () => handleDelete(courseId),
    });
  };

  const institutionGroupNames = Object.keys(coursesByInstitution);
  const allCourses = institutionGroupNames.flatMap(
    (name) => coursesByInstitution[name].courses
  );

  const filteredCourses = allCourses.filter((c) => {
    if (filterInstitution && c.institutions?.name !== filterInstitution)
      return false;
    if (filterCourse && c.name !== filterCourse) return false;
    if (filterShift && c.shift !== filterShift) return false;
    if (filterStatus) {
      const statusBool = filterStatus === "true";
      if (c.status !== statusBool) return false;
    }
    return true;
  });

  const availableInstitutions = [
    ...new Set(filteredCourses.map((c) => c.institutions?.name).filter(Boolean)),
  ];
  const availableCourses = [
    ...new Set(filteredCourses.map((c) => c.name).filter(Boolean)),
  ];
  const availableShifts = [
    ...new Set(filteredCourses.map((c) => c.shift).filter(Boolean)),
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Cursos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie cursos por instituição com informações detalhadas
          </p>
        </div>
        <Link
          to="/admin/courses/new"
          className="mt-4 sm:mt-0 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
        >
          <PlusIcon />
          Novo Curso
        </Link>
      </div>

      {/* Card de filtros */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <FilterableSelect
            options={availableInstitutions}
            value={filterInstitution}
            onChange={setFilterInstitution}
            placeholder="Instituição..."
          />
          <FilterableSelect
            options={availableCourses}
            value={filterCourse}
            onChange={setFilterCourse}
            placeholder="Curso..."
          />
          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">Todos os Turnos</option>
            {availableShifts.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">Todos os Status</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <p className="p-8 text-center text-gray-500">Carregando cursos...</p>
      )}

      {!isLoading && filteredCourses.length === 0 && !error && (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-md border">
          Nenhum curso encontrado.
        </div>
      )}

      {/* Cards administrativos com informações detalhadas */}
      {availableInstitutions.map((instName) => {
        const courses = filteredCourses.filter(
          (c) => c.institutions?.name === instName
        );
        if (courses.length === 0) return null;

        const isExpanded = expandedInstitutions[instName];
        const visibleCourses = isExpanded
          ? courses
          : courses.slice(0, limitPerInstitution);

        return (
          <div
            key={instName}
            className="mb-8 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <University className="w-5 h-5 text-blue-500" />
                {instName}
              </h2>
              <span className="text-sm text-gray-500">
                {courses.length} curso{courses.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {visibleCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col md:flex-row justify-between md:items-center px-6 py-5 hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-800 font-semibold text-lg">
                        {course.name}
                      </p>
                      <span
                        className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                          course.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {course.status ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Turno: {course.shift || "—"} • Ano:{" "}
                      {course.scholarshipYear || "—"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Vagas: {course.vacancies || "—"} | Bolsa:{" "}
                      {course.percentageScholarship
                        ? `${course.percentageScholarship}%`
                        : "—"}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      Valor Original:{" "}
                      <span className="font-medium">
                        R${course.originalValue?.toFixed(2) || "—"}
                      </span>{" "}
                      | Com Desconto:{" "}
                      <span className="font-medium text-blue-600">
                        R${course.discountValue?.toFixed(2) || "—"}
                      </span>{" "}
                      | Matrícula: R$
                      {course.discountEntrance?.toFixed(2) || "—"}
                    </p>
                    {course.description && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0 md:ml-6">
                    <button
                      onClick={() =>
                        navigate(`/admin/courses/edit/${course.id}`)
                      }
                      className="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => confirmarCancelamento(course.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {courses.length > limitPerInstitution && (
              <div className="bg-gray-50 px-6 py-3 text-center border-t">
                <button
                  onClick={() => toggleExpand(instName)}
                  className="text-blue-600 text-sm font-medium flex items-center justify-center gap-1 hover:underline"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Ver mais
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}

      <ConfirmModal
        isOpen={isModalOpen}
        title={modalProps.title}
        message={modalProps.message}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (onConfirmCallback) onConfirmCallback();
          setIsModalOpen(false);
        }}
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title={messageModalProps.title}
        message={messageModalProps.message}
        success={messageModalProps.success}
      />
    </div>
  );
}
