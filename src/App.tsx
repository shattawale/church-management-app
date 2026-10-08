import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { apiRequest, cloudStore, signUpAccount, supabase } from "./lib/supabase"
import churchLogo from "./assets/church-logo.png"

const CHURCH_NAME = "The Apostles' Continuation Church International"

type IconName = "home" | "people" | "calendar" | "heart" | "message" | "reports" | "settings" | "search" | "bell" | "plus" | "arrow" | "check" | "clock" | "chevron" | "more" | "user-plus" | "calendar-plus" | "globe" | "pin" | "edit" | "trash" | "close" | "send" | "mail" | "template" | "download" | "file" | "card" | "lock" | "eye"

const iconPaths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v10h13V10M9 20v-6h6v6" />
    </>
  ),
  people: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  ),
  message: (
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
  ),
  reports: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="m9 18 6-6-6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  chevron: <path d="m8 10 4 4 4-4" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  "user-plus": (
    <>
      <path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8" cy="7" r="4" />
      <path d="M19 8v6M16 11h6" />
    </>
  ),
  "calendar-plus": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18M12 13v5M9.5 15.5h5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  send: <path d="m22 2-7 20-4-9-9-4ZM22 2 11 13" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  template: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 3v18M8 9h13" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h2" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
}

type IconProps = {
  name: IconName
  size?: number
}

function Icon({ name, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  )
}

type NavItem = {
  label: string
  icon: IconName
}

const navItems: NavItem[] = [
  { label: "Overview", icon: "home" },
  { label: "People", icon: "people" },
  { label: "Calendar", icon: "calendar" },
  { label: "Giving", icon: "heart" },
  { label: "Communication", icon: "message" },
  { label: "Reports", icon: "reports" },
]

const schedule = [
  {
    day: "18",
    month: "JUN",
    title: "Sunday Worship",
    meta: "9:00 AM · Main Sanctuary",
    color: "sage",
  },
  {
    day: "19",
    month: "JUN",
    title: "Youth Summer Night",
    meta: "6:30 PM · The Commons",
    color: "clay",
  },
  {
    day: "21",
    month: "JUN",
    title: "Community Dinner",
    meta: "5:30 PM · Fellowship Hall",
    color: "gold",
  },
]

const people = [
  {
    initials: "EM",
    name: "Emily Martinez",
    detail: "Joined the Young Adults group",
    time: "12 min",
    tone: "rose",
  },
  {
    initials: "JD",
    name: "James Dawson",
    detail: "Completed a connection card",
    time: "34 min",
    tone: "blue",
  },
  {
    initials: "AK",
    name: "Amara King",
    detail: "Registered for Community Dinner",
    time: "1 hr",
    tone: "green",
  },
]

type Task = {
  id: string | number
  title: string
  meta: string
  done: boolean
}

const initialTasks: Task[] = [
  { id: 1, title: "Confirm Sunday volunteers", meta: "Due today", done: false },
  {
    id: 2,
    title: "Review new connection cards",
    meta: "8 people waiting",
    done: false,
  },
  {
    id: 3,
    title: "Send youth event reminder",
    meta: "Scheduled for 3:00 PM",
    done: true,
  },
]

const branches = [
  {
    id: "global",
    name: "All branches",
    city: "Global network",
    code: "GL",
    time: "7 locations",
    attendance: "4,860",
    giving: "$312,450",
    people: "186",
    groups: "92",
  },
  {
    id: "london",
    name: "London Central",
    city: "United Kingdom",
    code: "LDN",
    time: "2:42 PM",
    attendance: "1,248",
    giving: "$84,320",
    people: "42",
    groups: "28",
  },
  {
    id: "nairobi",
    name: "Nairobi West",
    city: "Kenya",
    code: "NBO",
    time: "4:42 PM",
    attendance: "986",
    giving: "$48,740",
    people: "38",
    groups: "19",
  },
  {
    id: "singapore",
    name: "Singapore City",
    city: "Singapore",
    code: "SGP",
    time: "9:42 PM",
    attendance: "1,106",
    giving: "$91,680",
    people: "51",
    groups: "24",
  },
  {
    id: "toronto",
    name: "Toronto North",
    city: "Canada",
    code: "YYZ",
    time: "9:42 AM",
    attendance: "874",
    giving: "$62,210",
    people: "34",
    groups: "16",
  },
]

type Member = {
  id: string | number
  firstName: string
  lastName: string
  email: string
  phone: string
  dateJoined: string
  branchId: string
  status: "Active" | "New" | "Inactive"
  group: string
}

const initialMembers: Member[] = [
  {
    id: 1,
    firstName: "Emily",
    lastName: "Martinez",
    email: "emily.martinez@example.com",
    phone: "+44 7700 900123",
    dateJoined: "2024-01-14",
    branchId: "london",
    status: "Active",
    group: "Young Adults",
  },
  {
    id: 2,
    firstName: "James",
    lastName: "Dawson",
    email: "james.dawson@example.com",
    phone: "+44 7700 900248",
    dateJoined: "2025-05-18",
    branchId: "london",
    status: "New",
    group: "Welcome Group",
  },
  {
    id: 3,
    firstName: "Amara",
    lastName: "King",
    email: "amara.king@example.com",
    phone: "+254 712 345 678",
    dateJoined: "2023-09-03",
    branchId: "nairobi",
    status: "Active",
    group: "Community Care",
  },
  {
    id: 4,
    firstName: "Daniel",
    lastName: "Tan",
    email: "daniel.tan@example.com",
    phone: "+65 8123 4567",
    dateJoined: "2022-11-20",
    branchId: "singapore",
    status: "Active",
    group: "Families",
  },
  {
    id: 5,
    firstName: "Olivia",
    lastName: "Chen",
    email: "olivia.chen@example.com",
    phone: "+1 416 555 0188",
    dateJoined: "2021-06-06",
    branchId: "toronto",
    status: "Inactive",
    group: "Not assigned",
  },
  {
    id: 6,
    firstName: "Samuel",
    lastName: "Otieno",
    email: "samuel.otieno@example.com",
    phone: "+254 723 456 789",
    dateJoined: "2025-04-27",
    branchId: "nairobi",
    status: "New",
    group: "Men's Fellowship",
  },
]

const emptyMember: Omit<Member, "id"> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateJoined: new Date().toISOString().slice(0, 10),
  branchId: "london",
  status: "Active",
  group: "",
}

function MemberManager({ selectedBranchId }: { selectedBranchId: string }) {
  const [members, setMembers] = useState<Member[]>([])
  const [query, setQuery] = useState("")
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [form, setForm] = useState(emptyMember)
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null)
  const [dataError, setDataError] = useState("")

  useEffect(() => {
    cloudStore
      .list<Member>("members")
      .then(setMembers)
      .catch((error) => setDataError(error.message))
  }, [])

  const visibleMembers = members.filter((member) => {
    const matchesBranch =
      selectedBranchId === "global" || member.branchId === selectedBranchId
    const searchText =
      `${member.firstName} ${member.lastName} ${member.email} ${member.group}`.toLowerCase()
    return matchesBranch && searchText.includes(query.toLowerCase())
  })

  const openAdd = () => {
    setEditingId(null)
    setForm({
      ...emptyMember,
      branchId: selectedBranchId === "global" ? "london" : selectedBranchId,
    })
    setEditorOpen(true)
  }

  const openEdit = (member: Member) => {
    const { id, ...memberForm } = member
    setEditingId(id)
    setForm(memberForm)
    setEditorOpen(true)
  }

  const saveMember = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (editingId) {
        const updated = await cloudStore.update<Member>(
          "members",
          editingId,
          form,
        )
        setMembers((current) =>
          current.map((member) => (member.id === editingId ? updated : member)),
        )
      } else {
        const created = await cloudStore.create<Member>("members", form)
        setMembers((current) => [created, ...current])
      }
      setDataError("")
      setEditorOpen(false)
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to save member.",
      )
    }
  }

  const removeMember = async () => {
    if (!deleteTarget) return
    try {
      await cloudStore.remove("members", deleteTarget.id)
      setMembers((current) =>
        current.filter((member) => member.id !== deleteTarget.id),
      )
      setDeleteTarget(null)
      setDataError("")
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to delete member.",
      )
    }
  }

  return (
    <section className="members-workspace">
      {dataError && <div className="cloud-error">{dataError}</div>}
      <div className="member-toolbar">
        <div className="member-search">
          <Icon name="search" size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search members..."
            aria-label="Search members"
          />
        </div>
        <div className="member-count">{visibleMembers.length} members</div>
        <button className="primary-button" onClick={openAdd}>
          <Icon name="user-plus" size={17} /> Add member
        </button>
      </div>

      <div className="members-panel">
        <div className="members-table-head">
          <span>MEMBER</span>
          <span>BRANCH</span>
          <span>GROUP</span>
          <span>STATUS</span>
          <span>ACTIONS</span>
        </div>
        <div className="members-list">
          {visibleMembers.map((member) => {
            const branch = branches.find((item) => item.id === member.branchId)
            return (
              <div className="member-row" key={member.id}>
                <div className="member-identity">
                  <div className="avatar member-avatar">
                    {member.firstName[0]}
                    {member.lastName[0]}
                  </div>
                  <div>
                    <strong>
                      {member.firstName} {member.lastName}
                    </strong>
                    <span>{member.email}</span>
                    <small>{member.phone}</small>
                  </div>
                </div>
                <div className="member-branch">
                  <strong>{branch?.name}</strong>
                  <span>{branch?.city}</span>
                </div>
                <div className="member-group">
                  {member.group || "Not assigned"}
                </div>
                <div>
                  <span
                    className={`status-pill ${member.status.toLowerCase()}`}
                  >
                    {member.status}
                  </span>
                </div>
                <div className="row-actions">
                  <button
                    onClick={() => openEdit(member)}
                    aria-label={`Edit ${member.firstName} ${member.lastName}`}
                  >
                    <Icon name="edit" size={16} />
                  </button>
                  <button
                    className="delete-action"
                    onClick={() => setDeleteTarget(member)}
                    aria-label={`Delete ${member.firstName} ${member.lastName}`}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>
            )
          })}
          {visibleMembers.length === 0 && (
            <div className="empty-members">
              <div>
                <Icon name="people" size={24} />
              </div>
              <strong>No members found</strong>
              <span>Try another search or add a new member.</span>
            </div>
          )}
        </div>
      </div>

      {editorOpen && (
        <div className="modal-layer" role="presentation">
          <div
            className="member-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-modal-title"
          >
            <div className="modal-header">
              <div>
                <span className="modal-icon">
                  <Icon name={editingId ? "edit" : "user-plus"} size={19} />
                </span>
                <div>
                  <h2 id="member-modal-title">
                    {editingId ? "Update member" : "Add a new member"}
                  </h2>
                  <p>Keep your church directory accurate and connected.</p>
                </div>
              </div>
              <button onClick={() => setEditorOpen(false)} aria-label="Close">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={saveMember}>
              <div className="form-grid">
                <label>
                  <span>First name</span>
                  <input
                    required
                    value={form.firstName}
                    onChange={(event) =>
                      setForm({ ...form, firstName: event.target.value })
                    }
                    placeholder="First name"
                  />
                </label>
                <label>
                  <span>Last name</span>
                  <input
                    required
                    value={form.lastName}
                    onChange={(event) =>
                      setForm({ ...form, lastName: event.target.value })
                    }
                    placeholder="Last name"
                  />
                </label>
                <label className="full-field">
                  <span>Email address</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    placeholder="name@example.com"
                  />
                </label>
                <label>
                  <span>Phone number</span>
                  <input
                    required
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                    placeholder="+1 555 000 0000"
                  />
                </label>
                <label>
                  <span>Date joined</span>
                  <input
                    required
                    type="date"
                    value={form.dateJoined}
                    onChange={(event) =>
                      setForm({ ...form, dateJoined: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Branch</span>
                  <select
                    value={form.branchId}
                    onChange={(event) =>
                      setForm({ ...form, branchId: event.target.value })
                    }
                  >
                    {branches.slice(1).map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Group</span>
                  <input
                    value={form.group}
                    onChange={(event) =>
                      setForm({ ...form, group: event.target.value })
                    }
                    placeholder="e.g. Young Adults"
                  />
                </label>
                <label>
                  <span>Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as Member["status"],
                      })
                    }
                  >
                    <option>Active</option>
                    <option>New</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditorOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? "Save changes" : "Add member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-layer" role="presentation">
          <div
            className="confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <div className="danger-icon">
              <Icon name="trash" size={21} />
            </div>
            <h2 id="delete-title">Delete this member?</h2>
            <p>
              This will permanently remove{" "}
              <strong>
                {deleteTarget.firstName} {deleteTarget.lastName}
              </strong>{" "}
              from the church directory.
            </p>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setDeleteTarget(null)}
              >
                Keep member
              </button>
              <button className="danger-button" onClick={removeMember}>
                Delete member
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

type Campaign = {
  id: string | number
  title: string
  preview: string
  channel: "Email" | "SMS" | "Email + SMS"
  audience: string
  branch: string
  status: "Sent" | "Scheduled" | "Draft"
  date: string
  performance?: string
}

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    title: "A note from Pastor Micah",
    preview: "This week, we’re reflecting on what it means to serve...",
    channel: "Email",
    audience: "All active members",
    branch: "All branches",
    status: "Sent",
    date: "Today, 9:00 AM",
    performance: "72% opened",
  },
  {
    id: 2,
    title: "Community Dinner reminder",
    preview: "We can’t wait to gather around the table this Friday...",
    channel: "Email + SMS",
    audience: "Event registrants",
    branch: "London Central",
    status: "Scheduled",
    date: "Today, 3:00 PM",
  },
  {
    id: 3,
    title: "Volunteer team update",
    preview: "Thank you for making every Sunday feel like home...",
    channel: "Email",
    audience: "Serving teams",
    branch: "All branches",
    status: "Draft",
    date: "Edited 2 hours ago",
  },
  {
    id: 4,
    title: "Youth Summer Night",
    preview: "Summer starts here. Join us for an evening of community...",
    channel: "SMS",
    audience: "Youth & parents",
    branch: "Nairobi West",
    status: "Sent",
    date: "Jun 12, 6:30 PM",
    performance: "94% delivered",
  },
]

function CommunicationManager({
  selectedBranchId,
}: {
  selectedBranchId: string
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filter, setFilter] = useState<"All" | Campaign["status"]>("All")
  const [composeOpen, setComposeOpen] = useState(false)
  const [form, setForm] = useState({
    title: "",
    message: "",
    channel: "Email" as Campaign["channel"],
    audience: "All active members",
    branch: selectedBranchId === "global" ? "global" : selectedBranchId,
    schedule: "now",
    date: "",
  })
  const [dataError, setDataError] = useState("")

  useEffect(() => {
    cloudStore
      .list<Campaign>("campaigns")
      .then(setCampaigns)
      .catch((error) => setDataError(error.message))
  }, [])

  const visibleCampaigns = campaigns.filter((campaign) => {
    const matchesStatus = filter === "All" || campaign.status === filter
    const selected = branches.find((branch) => branch.id === selectedBranchId)
    const matchesBranch =
      selectedBranchId === "global" ||
      campaign.branch === selected?.name ||
      campaign.branch === "All branches"
    return matchesStatus && matchesBranch
  })

  const saveCampaign = async (event: FormEvent) => {
    event.preventDefault()
    const branch = branches.find((item) => item.id === form.branch)
    const scheduled = form.schedule === "later"
    try {
      const created = await cloudStore.create<Campaign>("campaigns", {
        title: form.title,
        preview: form.message,
        channel: form.channel,
        audience: form.audience,
        branch: branch?.name ?? "All branches",
        status: scheduled ? "Scheduled" : "Sent",
        date:
          scheduled && form.date
            ? new Date(form.date).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Just now",
        performance: scheduled ? undefined : "Sending now",
      })
      setCampaigns((current) => [created, ...current])
      setComposeOpen(false)
      setForm({ ...form, title: "", message: "", date: "" })
      setDataError("")
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to save message.",
      )
    }
  }

  return (
    <section className="communications-workspace">
      {dataError && <div className="cloud-error">{dataError}</div>}
      <div className="comm-summary">
        <article>
          <span className="comm-stat-icon green">
            <Icon name="mail" size={18} />
          </span>
          <div>
            <small>DELIVERED THIS MONTH</small>
            <strong>18,460</strong>
            <span>98.7% delivery rate</span>
          </div>
        </article>
        <article>
          <span className="comm-stat-icon gold">
            <Icon name="reports" size={18} />
          </span>
          <div>
            <small>AVERAGE OPEN RATE</small>
            <strong>68.4%</strong>
            <span>↑ 5.2% from last month</span>
          </div>
        </article>
        <article>
          <span className="comm-stat-icon clay">
            <Icon name="clock" size={18} />
          </span>
          <div>
            <small>SCHEDULED</small>
            <strong>6</strong>
            <span>Across 4 local time zones</span>
          </div>
        </article>
      </div>

      <div className="comm-layout">
        <aside className="comm-nav panel">
          <button
            className="compose-button"
            onClick={() => setComposeOpen(true)}
          >
            <Icon name="edit" size={17} /> Compose
          </button>
          <div className="comm-nav-label">MESSAGES</div>
          {(["All", "Draft", "Scheduled", "Sent"] as const).map((item) => (
            <button
              className={filter === item ? "active" : ""}
              key={item}
              onClick={() => setFilter(item)}
            >
              <Icon
                name={
                  item === "Draft"
                    ? "edit"
                    : item === "Scheduled"
                      ? "clock"
                      : item === "Sent"
                        ? "send"
                        : "mail"
                }
                size={16}
              />
              <span>{item === "All" ? "All messages" : item}</span>
              <small>
                {item === "All"
                  ? campaigns.length
                  : campaigns.filter((campaign) => campaign.status === item)
                      .length}
              </small>
            </button>
          ))}
          <div className="comm-nav-label second">TOOLS</div>
          <button>
            <Icon name="template" size={16} />
            <span>Templates</span>
            <small>12</small>
          </button>
          <button>
            <Icon name="people" size={16} />
            <span>Audiences</span>
          </button>
          <div className="comm-tip">
            <span>
              <Icon name="globe" size={16} />
            </span>
            <strong>Global delivery</strong>
            <p>Messages are sent at the right local time for every branch.</p>
          </div>
        </aside>

        <div className="campaigns-panel panel">
          <div className="campaigns-header">
            <div>
              <h2>{filter === "All" ? "Recent messages" : filter}</h2>
              <p>Communications across your church network</p>
            </div>
            <div className="campaign-actions">
              <button>
                <Icon name="search" size={16} />
              </button>
              <button>
                Last 30 days <Icon name="chevron" size={14} />
              </button>
            </div>
          </div>
          <div className="campaign-list">
            {visibleCampaigns.map((campaign) => (
              <button className="campaign-row" key={campaign.id}>
                <span
                  className={`channel-icon ${
                    campaign.channel.includes("SMS") ? "sms" : ""
                  }`}
                >
                  <Icon
                    name={campaign.channel === "SMS" ? "message" : "mail"}
                    size={17}
                  />
                </span>
                <span className="campaign-main">
                  <span>
                    <strong>{campaign.title}</strong>
                    <i
                      className={`campaign-status ${campaign.status.toLowerCase()}`}
                    >
                      {campaign.status}
                    </i>
                  </span>
                  <small>{campaign.preview}</small>
                  <span className="campaign-tags">
                    <i>{campaign.audience}</i>
                    <i>
                      <Icon name="pin" size={10} />
                      {campaign.branch}
                    </i>
                  </span>
                </span>
                <span className="campaign-meta">
                  <strong>{campaign.date}</strong>
                  <small>{campaign.performance ?? campaign.channel}</small>
                </span>
                <Icon name="more" size={17} />
              </button>
            ))}
            {visibleCampaigns.length === 0 && (
              <div className="empty-campaigns">
                <Icon name="mail" size={24} />
                <strong>No {filter.toLowerCase()} messages</strong>
                <span>
                  Create a message to start connecting with your community.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {composeOpen && (
        <div className="modal-layer" role="presentation">
          <div
            className="compose-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="compose-title"
          >
            <div className="modal-header">
              <div>
                <span className="modal-icon">
                  <Icon name="send" size={19} />
                </span>
                <div>
                  <h2 id="compose-title">Create a message</h2>
                  <p>Connect with the right people, wherever they are.</p>
                </div>
              </div>
              <button onClick={() => setComposeOpen(false)} aria-label="Close">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={saveCampaign}>
              <div className="compose-grid">
                <label className="full-field">
                  <span>Message title</span>
                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder="Give your message a clear title"
                  />
                </label>
                <label>
                  <span>Channel</span>
                  <select
                    value={form.channel}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        channel: event.target.value as Campaign["channel"],
                      })
                    }
                  >
                    <option>Email</option>
                    <option>SMS</option>
                    <option>Email + SMS</option>
                  </select>
                </label>
                <label>
                  <span>Send from</span>
                  <select
                    value={form.branch}
                    onChange={(event) =>
                      setForm({ ...form, branch: event.target.value })
                    }
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="full-field">
                  <span>Audience</span>
                  <select
                    value={form.audience}
                    onChange={(event) =>
                      setForm({ ...form, audience: event.target.value })
                    }
                  >
                    <option>All active members</option>
                    <option>New members</option>
                    <option>Serving teams</option>
                    <option>Event registrants</option>
                    <option>Youth & parents</option>
                  </select>
                </label>
                <label className="full-field">
                  <span>Message</span>
                  <textarea
                    required
                    value={form.message}
                    onChange={(event) =>
                      setForm({ ...form, message: event.target.value })
                    }
                    placeholder="Write your message..."
                    rows={6}
                  />
                </label>
                <div className="send-options full-field">
                  <button
                    type="button"
                    className={form.schedule === "now" ? "active" : ""}
                    onClick={() => setForm({ ...form, schedule: "now" })}
                  >
                    <Icon name="send" size={15} />
                    <span>
                      <strong>Send now</strong>
                      <small>Deliver immediately</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={form.schedule === "later" ? "active" : ""}
                    onClick={() => setForm({ ...form, schedule: "later" })}
                  >
                    <Icon name="clock" size={15} />
                    <span>
                      <strong>Schedule</strong>
                      <small>Choose a date and time</small>
                    </span>
                  </button>
                </div>
                {form.schedule === "later" && (
                  <label className="full-field">
                    <span>Schedule date</span>
                    <input
                      required
                      type="datetime-local"
                      value={form.date}
                      onChange={(event) =>
                        setForm({ ...form, date: event.target.value })
                      }
                    />
                  </label>
                )}
              </div>
              <div className="compose-footer">
                <span>
                  <Icon name="globe" size={14} /> Local-time delivery enabled
                </span>
                <div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setComposeOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <Icon
                      name={form.schedule === "later" ? "clock" : "send"}
                      size={15}
                    />
                    {form.schedule === "later"
                      ? "Schedule message"
                      : "Send message"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

type Gift = {
  id: string | number
  donor: string
  initials: string
  amount: number
  fund: string
  branchId: string
  method: string
  type: "One-time" | "Recurring"
  date: string
}

const initialGifts: Gift[] = [
  {
    id: 1,
    donor: "Emily Martinez",
    initials: "EM",
    amount: 250,
    fund: "General Fund",
    branchId: "london",
    method: "Card",
    type: "Recurring",
    date: "Today, 10:24 AM",
  },
  {
    id: 2,
    donor: "Anonymous",
    initials: "AN",
    amount: 1000,
    fund: "Community Care",
    branchId: "nairobi",
    method: "Bank transfer",
    type: "One-time",
    date: "Today, 8:15 AM",
  },
  {
    id: 3,
    donor: "Daniel Tan",
    initials: "DT",
    amount: 180,
    fund: "Missions",
    branchId: "singapore",
    method: "Card",
    type: "Recurring",
    date: "Yesterday",
  },
  {
    id: 4,
    donor: "Olivia Chen",
    initials: "OC",
    amount: 400,
    fund: "Building Fund",
    branchId: "toronto",
    method: "Bank transfer",
    type: "One-time",
    date: "Jun 13, 4:30 PM",
  },
  {
    id: 5,
    donor: "Samuel Otieno",
    initials: "SO",
    amount: 75,
    fund: "General Fund",
    branchId: "nairobi",
    method: "Mobile money",
    type: "Recurring",
    date: "Jun 13, 1:12 PM",
  },
]

function GivingManager({ selectedBranchId }: { selectedBranchId: string }) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [giftType, setGiftType] = useState<"All" | Gift["type"]>("All")
  const [recordOpen, setRecordOpen] = useState(false)
  const [giftForm, setGiftForm] = useState({
    donor: "",
    amount: "",
    fund: "General Fund",
    branchId: selectedBranchId === "global" ? "london" : selectedBranchId,
    method: "Card",
    type: "One-time" as Gift["type"],
  })
  const [dataError, setDataError] = useState("")

  useEffect(() => {
    cloudStore
      .list<Gift>("gifts")
      .then(setGifts)
      .catch((error) => setDataError(error.message))
  }, [])

  const visibleGifts = gifts.filter((gift) => {
    const branchMatch =
      selectedBranchId === "global" || gift.branchId === selectedBranchId
    return branchMatch && (giftType === "All" || gift.type === giftType)
  })

  const recordGift = async (event: FormEvent) => {
    event.preventDefault()
    const names = giftForm.donor.trim().split(/\s+/)
    try {
      const created = await cloudStore.create<Gift>("gifts", {
        donor: giftForm.donor,
        initials: names
          .map((name) => name[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        amount: Number(giftForm.amount),
        fund: giftForm.fund,
        branchId: giftForm.branchId,
        method: giftForm.method,
        type: giftForm.type,
        date: "Just now",
      })
      setGifts((current) => [created, ...current])
      setRecordOpen(false)
      setGiftForm({ ...giftForm, donor: "", amount: "" })
      setDataError("")
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to record gift.",
      )
    }
  }

  return (
    <section className="giving-workspace">
      {dataError && <div className="cloud-error">{dataError}</div>}
      <div className="giving-hero">
        <div>
          <span>JUNE GIVING</span>
          <strong>
            {selectedBranchId === "global"
              ? "$312,450"
              : branches.find((branch) => branch.id === selectedBranchId)
                  ?.giving}
          </strong>
          <p>
            <i>↑ 8.4%</i> compared with last month
          </p>
        </div>
        <div className="giving-goal">
          <div>
            <span>MONTHLY GOAL</span>
            <strong>$420,000</strong>
          </div>
          <div className="goal-ring">
            <span>74%</span>
          </div>
        </div>
        <div className="giving-spark">
          <div className="spark-bars">
            {[46, 63, 55, 72, 68, 84, 78, 91, 76, 88, 96, 86].map(
              (height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ),
            )}
          </div>
          <span>Daily giving · June</span>
        </div>
      </div>

      <div className="giving-stats">
        <article>
          <span className="giving-stat-icon">
            <Icon name="people" size={18} />
          </span>
          <div>
            <small>ACTIVE GIVERS</small>
            <strong>1,842</strong>
            <p>126 first-time givers</p>
          </div>
        </article>
        <article>
          <span className="giving-stat-icon gold">
            <Icon name="clock" size={18} />
          </span>
          <div>
            <small>RECURRING</small>
            <strong>$186,720</strong>
            <p>60% of total giving</p>
          </div>
        </article>
        <article>
          <span className="giving-stat-icon clay">
            <Icon name="heart" size={18} />
          </span>
          <div>
            <small>AVERAGE GIFT</small>
            <strong>$169</strong>
            <p>↑ $12 this month</p>
          </div>
        </article>
      </div>

      <div className="giving-grid">
        <article className="panel transactions-panel">
          <div className="giving-panel-header">
            <div>
              <h2>Recent gifts</h2>
              <p>Latest contributions across the network</p>
            </div>
            <button
              className="primary-button"
              onClick={() => setRecordOpen(true)}
            >
              <Icon name="plus" size={16} /> Record gift
            </button>
          </div>
          <div className="giving-tabs">
            {(["All", "Recurring", "One-time"] as const).map((type) => (
              <button
                className={giftType === type ? "active" : ""}
                onClick={() => setGiftType(type)}
                key={type}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="gift-list">
            {visibleGifts.map((gift) => {
              const branch = branches.find((item) => item.id === gift.branchId)
              return (
                <div className="gift-row" key={gift.id}>
                  <div className="avatar gift-avatar">{gift.initials}</div>
                  <div className="gift-person">
                    <strong>{gift.donor}</strong>
                    <span>
                      {gift.method} · {branch?.name}
                    </span>
                  </div>
                  <div className="gift-fund">
                    <span>{gift.fund}</span>
                    <small>{gift.type}</small>
                  </div>
                  <div className="gift-amount">
                    <strong>${gift.amount.toLocaleString()}</strong>
                    <span>{gift.date}</span>
                  </div>
                  <button aria-label="Gift options">
                    <Icon name="more" size={17} />
                  </button>
                </div>
              )
            })}
          </div>
        </article>

        <article className="panel funds-panel">
          <div className="giving-panel-header">
            <div>
              <h2>Fund progress</h2>
              <p>June allocation by fund</p>
            </div>
            <button className="text-button">
              Manage funds <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="fund-list">
            {[
              ["General Fund", "$182,400", 82, "green"],
              ["Missions", "$58,240", 68, "gold"],
              ["Community Care", "$41,810", 76, "clay"],
              ["Building Fund", "$29,960", 52, "blue"],
            ].map(([name, amount, progress, tone]) => (
              <div className="fund-row" key={name}>
                <div>
                  <span className={`fund-dot ${tone}`} />
                  <strong>{name}</strong>
                  <span>{amount}</span>
                </div>
                <div className="fund-progress">
                  <i>
                    <span
                      className={`${tone}`}
                      style={{ width: `${progress}%` }}
                    />
                  </i>
                  <small>{progress}% of goal</small>
                </div>
              </div>
            ))}
          </div>
          <div className="giving-methods">
            <span>GIVING METHODS</span>
            <div>
              <i className="method-card" style={{ width: "58%" }} />
              <i className="method-bank" style={{ width: "27%" }} />
              <i className="method-other" style={{ width: "15%" }} />
            </div>
            <p>
              <span>
                <i className="method-card" />
                Card 58%
              </span>
              <span>
                <i className="method-bank" />
                Bank 27%
              </span>
              <span>
                <i className="method-other" />
                Other 15%
              </span>
            </p>
          </div>
        </article>
      </div>

      {recordOpen && (
        <div className="modal-layer" role="presentation">
          <div
            className="member-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-title"
          >
            <div className="modal-header">
              <div>
                <span className="modal-icon">
                  <Icon name="heart" size={19} />
                </span>
                <div>
                  <h2 id="gift-title">Record a gift</h2>
                  <p>Add an offline or manually received contribution.</p>
                </div>
              </div>
              <button onClick={() => setRecordOpen(false)} aria-label="Close">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={recordGift}>
              <div className="form-grid">
                <label className="full-field">
                  <span>Donor name</span>
                  <input
                    required
                    value={giftForm.donor}
                    onChange={(event) =>
                      setGiftForm({ ...giftForm, donor: event.target.value })
                    }
                    placeholder="Full name"
                  />
                </label>
                <label>
                  <span>Amount</span>
                  <input
                    required
                    min="1"
                    step="0.01"
                    type="number"
                    value={giftForm.amount}
                    onChange={(event) =>
                      setGiftForm({ ...giftForm, amount: event.target.value })
                    }
                    placeholder="0.00"
                  />
                </label>
                <label>
                  <span>Gift type</span>
                  <select
                    value={giftForm.type}
                    onChange={(event) =>
                      setGiftForm({
                        ...giftForm,
                        type: event.target.value as Gift["type"],
                      })
                    }
                  >
                    <option>One-time</option>
                    <option>Recurring</option>
                  </select>
                </label>
                <label>
                  <span>Fund</span>
                  <select
                    value={giftForm.fund}
                    onChange={(event) =>
                      setGiftForm({ ...giftForm, fund: event.target.value })
                    }
                  >
                    <option>General Fund</option>
                    <option>Missions</option>
                    <option>Community Care</option>
                    <option>Building Fund</option>
                  </select>
                </label>
                <label>
                  <span>Method</span>
                  <select
                    value={giftForm.method}
                    onChange={(event) =>
                      setGiftForm({ ...giftForm, method: event.target.value })
                    }
                  >
                    <option>Card</option>
                    <option>Bank transfer</option>
                    <option>Cash</option>
                    <option>Mobile money</option>
                  </select>
                </label>
                <label className="full-field">
                  <span>Branch</span>
                  <select
                    value={giftForm.branchId}
                    onChange={(event) =>
                      setGiftForm({ ...giftForm, branchId: event.target.value })
                    }
                  >
                    {branches.slice(1).map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setRecordOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Record gift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

const reportTemplates = [
  {
    title: "Attendance summary",
    description: "Weekly attendance, visitors, and service trends.",
    icon: "people" as IconName,
    tone: "green",
    tag: "People",
  },
  {
    title: "Giving statement",
    description: "Contributions by fund, donor, and payment method.",
    icon: "heart" as IconName,
    tone: "clay",
    tag: "Finance",
  },
  {
    title: "Membership growth",
    description: "New, active, and inactive member movement.",
    icon: "reports" as IconName,
    tone: "gold",
    tag: "People",
  },
  {
    title: "Group engagement",
    description: "Participation and connection across small groups.",
    icon: "message" as IconName,
    tone: "blue",
    tag: "Engagement",
  },
  {
    title: "Branch comparison",
    description: "Compare ministry health across global branches.",
    icon: "globe" as IconName,
    tone: "green",
    tag: "Global",
  },
  {
    title: "Volunteer coverage",
    description: "Serving team capacity, gaps, and retention.",
    icon: "calendar" as IconName,
    tone: "gold",
    tag: "Teams",
  },
]

function ReportsManager({ selectedBranchId }: { selectedBranchId: string }) {
  const [category, setCategory] = useState("All")
  const [range, setRange] = useState("Last 30 days")
  const [generated, setGenerated] = useState<string | null>(null)
  const visibleReports = reportTemplates.filter(
    (report) => category === "All" || report.tag === category,
  )

  const generateReport = (title: string) => {
    const branch =
      branches.find((item) => item.id === selectedBranchId)?.name ??
      "All branches"
    const content = `${CHURCH_NAME},${title}\nScope,${branch}\nDate range,${range}\nGenerated,${new Date().toLocaleDateString()}\n\nMetric,Value\nTotal records,1248\nChange,8.4%\nStatus,Complete`
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.toLowerCase().replace(/ /g, "-")}.csv`
    link.click()
    URL.revokeObjectURL(url)
    setGenerated(title)
    window.setTimeout(() => setGenerated(null), 2600)
  }

  return (
    <section className="reports-workspace">
      <div className="report-toolbar">
        <div className="report-search">
          <Icon name="search" size={16} />
          <input placeholder="Search reports..." aria-label="Search reports" />
        </div>
        <button className="period-button">
          {range} <Icon name="chevron" size={14} />
        </button>
        <button
          className="primary-button"
          onClick={() => generateReport("Custom report")}
        >
          <Icon name="plus" size={16} /> Create report
        </button>
      </div>
      <div className="report-highlight">
        <div className="highlight-copy">
          <span className="report-kicker">
            <Icon name="reports" size={14} /> MINISTRY SNAPSHOT
          </span>
          <h2>Your global network is growing</h2>
          <p>
            Attendance is up 8.4% and 186 people joined across seven branches
            this month.
          </p>
          <div>
            <button onClick={() => generateReport("Ministry snapshot")}>
              <Icon name="download" size={15} /> Download snapshot
            </button>
            <button>
              View insights <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
        <div className="highlight-chart">
          {[48, 60, 54, 67, 63, 76, 72, 88].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }}>
              <i />
            </span>
          ))}
        </div>
      </div>
      <div className="reports-layout">
        <div className="report-library">
          <div className="reports-heading">
            <div>
              <h2>Report library</h2>
              <p>Generate insights from your ministry data</p>
            </div>
            <div className="report-categories">
              {["All", "People", "Finance", "Engagement", "Global"].map(
                (item) => (
                  <button
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                    key={item}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="report-grid">
            {visibleReports.map((report) => (
              <article className="report-card" key={report.title}>
                <span className={`report-icon ${report.tone}`}>
                  <Icon name={report.icon} size={19} />
                </span>
                <span className="report-tag">{report.tag}</span>
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <button onClick={() => generateReport(report.title)}>
                  Generate report <Icon name="arrow" size={14} />
                </button>
              </article>
            ))}
          </div>
        </div>
        <aside className="report-sidebar">
          <article className="panel">
            <div className="side-report-head">
              <div>
                <h2>Scheduled reports</h2>
                <p>Delivered automatically</p>
              </div>
              <button>
                <Icon name="plus" size={15} />
              </button>
            </div>
            <div className="scheduled-list">
              <div>
                <span className="schedule-report-icon">
                  <Icon name="mail" size={15} />
                </span>
                <div>
                  <strong>Weekly attendance</strong>
                  <small>Every Monday · 8:00 AM</small>
                </div>
                <i>On</i>
              </div>
              <div>
                <span className="schedule-report-icon gold">
                  <Icon name="heart" size={15} />
                </span>
                <div>
                  <strong>Monthly giving</strong>
                  <small>1st of month · Finance team</small>
                </div>
                <i>On</i>
              </div>
            </div>
          </article>
          <article className="panel recent-reports">
            <div className="side-report-head">
              <div>
                <h2>Recently generated</h2>
                <p>Your latest exports</p>
              </div>
            </div>
            <div>
              <button>
                <span>
                  <Icon name="file" size={15} />
                </span>
                <div>
                  <strong>May giving statement</strong>
                  <small>CSV · Jun 2</small>
                </div>
                <Icon name="download" size={14} />
              </button>
              <button>
                <span>
                  <Icon name="file" size={15} />
                </span>
                <div>
                  <strong>Q2 member growth</strong>
                  <small>PDF · May 29</small>
                </div>
                <Icon name="download" size={14} />
              </button>
            </div>
          </article>
        </aside>
      </div>
      {generated && (
        <div className="report-toast">
          <span>
            <Icon name="check" size={15} />
          </span>
          <div>
            <strong>Report generated</strong>
            <small>{generated} was downloaded successfully.</small>
          </div>
        </div>
      )}
    </section>
  )
}

type ChurchEvent = {
  id: string | number
  title: string
  date: string
  time: string
  endTime: string
  category: "Worship" | "Groups" | "Youth" | "Community" | "Leadership"
  branchId: string
  location: string
}

const initialCalendarEvents: ChurchEvent[] = [
  {
    id: 1,
    title: "Sunday Worship",
    date: "2025-06-01",
    time: "9:00 AM",
    endTime: "11:00 AM",
    category: "Worship",
    branchId: "london",
    location: "Main Sanctuary",
  },
  {
    id: 2,
    title: "Staff prayer",
    date: "2025-06-04",
    time: "8:00 AM",
    endTime: "9:00 AM",
    category: "Leadership",
    branchId: "london",
    location: "Prayer Room",
  },
  {
    id: 3,
    title: "Young Adults",
    date: "2025-06-06",
    time: "7:00 PM",
    endTime: "9:00 PM",
    category: "Groups",
    branchId: "toronto",
    location: "The Commons",
  },
  {
    id: 4,
    title: "Community outreach",
    date: "2025-06-08",
    time: "10:00 AM",
    endTime: "1:00 PM",
    category: "Community",
    branchId: "nairobi",
    location: "Kibera Community Center",
  },
  {
    id: 5,
    title: "Leadership gathering",
    date: "2025-06-11",
    time: "6:30 PM",
    endTime: "8:30 PM",
    category: "Leadership",
    branchId: "singapore",
    location: "Conference Hall",
  },
  {
    id: 6,
    title: "Youth Summer Night",
    date: "2025-06-14",
    time: "6:30 PM",
    endTime: "9:00 PM",
    category: "Youth",
    branchId: "london",
    location: "The Commons",
  },
  {
    id: 7,
    title: "Sunday Worship",
    date: "2025-06-15",
    time: "9:00 AM",
    endTime: "11:00 AM",
    category: "Worship",
    branchId: "london",
    location: "Main Sanctuary",
  },
  {
    id: 8,
    title: "Community Dinner",
    date: "2025-06-18",
    time: "5:30 PM",
    endTime: "8:00 PM",
    category: "Community",
    branchId: "nairobi",
    location: "Fellowship Hall",
  },
  {
    id: 9,
    title: "Small Group Leaders",
    date: "2025-06-21",
    time: "9:30 AM",
    endTime: "12:00 PM",
    category: "Groups",
    branchId: "toronto",
    location: "Room 204",
  },
  {
    id: 10,
    title: "Sunday Worship",
    date: "2025-06-22",
    time: "10:00 AM",
    endTime: "12:00 PM",
    category: "Worship",
    branchId: "singapore",
    location: "City Auditorium",
  },
  {
    id: 11,
    title: "Global Pastors Call",
    date: "2025-06-25",
    time: "2:00 PM",
    endTime: "3:30 PM",
    category: "Leadership",
    branchId: "global",
    location: "Online",
  },
  {
    id: 12,
    title: "Family Picnic",
    date: "2025-06-28",
    time: "11:00 AM",
    endTime: "3:00 PM",
    category: "Community",
    branchId: "toronto",
    location: "Riverside Park",
  },
]

const dateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function CalendarManager({ selectedBranchId }: { selectedBranchId: string }) {
  const [events, setEvents] = useState<ChurchEvent[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5, 1))
  const [selectedDate, setSelectedDate] = useState("2025-06-14")
  const [category, setCategory] = useState<"All" | ChurchEvent["category"]>(
    "All",
  )
  const [eventOpen, setEventOpen] = useState(false)
  const [eventForm, setEventForm] = useState({
    title: "",
    date: selectedDate,
    time: "09:00",
    endTime: "10:00",
    category: "Worship" as ChurchEvent["category"],
    branchId: selectedBranchId === "global" ? "london" : selectedBranchId,
    location: "",
  })
  const [dataError, setDataError] = useState("")

  useEffect(() => {
    cloudStore
      .list<ChurchEvent>("events")
      .then(setEvents)
      .catch((error) => setDataError(error.message))
  }, [])

  const firstDayOffset = (currentMonth.getDay() + 6) % 7
  const calendarStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1 - firstDayOffset,
  )
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart)
    date.setDate(calendarStart.getDate() + index)
    return date
  })
  const scopedEvents = events.filter(
    (event) =>
      (selectedBranchId === "global" ||
        event.branchId === selectedBranchId ||
        event.branchId === "global") &&
      (category === "All" || event.category === category),
  )
  const selectedEvents = scopedEvents.filter(
    (event) => event.date === selectedDate,
  )
  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const moveMonth = (amount: number) => {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + amount,
      1,
    )
    setCurrentMonth(next)
    setSelectedDate(dateKey(next))
  }

  const openCreateEvent = () => {
    setEventForm({
      ...eventForm,
      date: selectedDate,
      branchId: selectedBranchId === "global" ? "london" : selectedBranchId,
    })
    setEventOpen(true)
  }

  const createEvent = async (event: FormEvent) => {
    event.preventDefault()
    const displayTime = new Date(
      `2000-01-01T${eventForm.time}`,
    ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    const displayEnd = new Date(
      `2000-01-01T${eventForm.endTime}`,
    ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    try {
      const created = await cloudStore.create<ChurchEvent>("events", {
        ...eventForm,
        time: displayTime,
        endTime: displayEnd,
      })
      setEvents((current) => [...current, created])
      setSelectedDate(eventForm.date)
      const chosen = new Date(`${eventForm.date}T12:00:00`)
      setCurrentMonth(new Date(chosen.getFullYear(), chosen.getMonth(), 1))
      setEventOpen(false)
      setEventForm({ ...eventForm, title: "", location: "" })
      setDataError("")
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to create event.",
      )
    }
  }

  return (
    <section className="calendar-workspace">
      {dataError && <div className="cloud-error">{dataError}</div>}
      <div className="calendar-toolbar">
        <div className="calendar-view-switch">
          <button className="active">Month</button>
          <button>Week</button>
          <button>Agenda</button>
        </div>
        <div className="calendar-filter">
          <Icon name="globe" size={15} />
          <span>
            {branches.find((branch) => branch.id === selectedBranchId)?.name}
          </span>
          <Icon name="chevron" size={14} />
        </div>
        <button className="primary-button" onClick={openCreateEvent}>
          <Icon name="calendar-plus" size={17} /> Create event
        </button>
      </div>

      <div className="calendar-layout">
        <article className="panel calendar-main">
          <div className="calendar-heading">
            <div>
              <button onClick={() => moveMonth(-1)} aria-label="Previous month">
                <Icon name="arrow" size={17} />
              </button>
              <h2>{monthLabel}</h2>
              <button onClick={() => moveMonth(1)} aria-label="Next month">
                <Icon name="arrow" size={17} />
              </button>
            </div>
            <button
              onClick={() => {
                setCurrentMonth(new Date(2025, 5, 1))
                setSelectedDate("2025-06-14")
              }}
            >
              Today
            </button>
          </div>
          <div className="calendar-categories">
            {([
              "All",
              "Worship",
              "Groups",
              "Youth",
              "Community",
              "Leadership",
            ] as const).map((item) => (
              <button
                className={
                  category === item ? `active ${item.toLowerCase()}` : ""
                }
                onClick={() => setCategory(item)}
                key={item}
              >
                <i />
                {item}
              </button>
            ))}
          </div>
          <div className="calendar-weekdays">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((date) => {
              const key = dateKey(date)
              const dayEvents = scopedEvents.filter(
                (event) => event.date === key,
              )
              const outside = date.getMonth() !== currentMonth.getMonth()
              return (
                <button
                  className={`calendar-day ${outside ? "outside" : ""} ${
                    selectedDate === key ? "selected" : ""
                  } ${key === "2025-06-14" ? "today" : ""}`}
                  key={key}
                  onClick={() => setSelectedDate(key)}
                >
                  <span>{date.getDate()}</span>
                  <div>
                    {dayEvents.slice(0, 2).map((event) => (
                      <i
                        className={event.category.toLowerCase()}
                        key={event.id}
                      >
                        {event.title}
                      </i>
                    ))}
                    {dayEvents.length > 2 && (
                      <small>+{dayEvents.length - 2} more</small>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </article>

        <aside className="calendar-sidebar">
          <article className="panel day-panel">
            <div className="selected-date">
              <span>
                {new Date(`${selectedDate}T12:00:00`)
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase()}
              </span>
              <strong>{new Date(`${selectedDate}T12:00:00`).getDate()}</strong>
              <small>
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" },
                )}
              </small>
            </div>
            <div className="day-panel-heading">
              <div>
                <h2>Schedule</h2>
                <p>
                  {selectedEvents.length}{" "}
                  {selectedEvents.length === 1 ? "event" : "events"} planned
                </p>
              </div>
              <button onClick={openCreateEvent}>
                <Icon name="plus" size={15} />
              </button>
            </div>
            <div className="day-events">
              {selectedEvents.map((event) => {
                const branch = branches.find(
                  (item) => item.id === event.branchId,
                )
                return (
                  <button className="day-event" key={event.id}>
                    <span
                      className={`event-stripe ${event.category.toLowerCase()}`}
                    />
                    <div>
                      <span>
                        {event.time} – {event.endTime}
                      </span>
                      <strong>{event.title}</strong>
                      <small>
                        <Icon name="pin" size={11} />
                        {event.location}
                      </small>
                      <i>{branch?.name ?? "All branches"}</i>
                    </div>
                    <Icon name="more" size={16} />
                  </button>
                )
              })}
              {selectedEvents.length === 0 && (
                <div className="empty-day">
                  <span>
                    <Icon name="calendar" size={20} />
                  </span>
                  <strong>No events scheduled</strong>
                  <p>This day is open for ministry.</p>
                  <button onClick={openCreateEvent}>Add an event</button>
                </div>
              )}
            </div>
          </article>
          <article className="panel upcoming-mini">
            <div className="panel-header">
              <div>
                <h2>Coming up</h2>
                <p>Next across your network</p>
              </div>
            </div>
            {scopedEvents
              .filter((event) => event.date >= selectedDate)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 3)
              .map((event) => (
                <div key={event.id}>
                  <span>
                    <strong>
                      {new Date(`${event.date}T12:00:00`).getDate()}
                    </strong>
                    <small>
                      {new Date(`${event.date}T12:00:00`)
                        .toLocaleDateString("en-US", { month: "short" })
                        .toUpperCase()}
                    </small>
                  </span>
                  <div>
                    <strong>{event.title}</strong>
                    <small>
                      {event.time} · {event.location}
                    </small>
                  </div>
                </div>
              ))}
          </article>
        </aside>
      </div>

      {eventOpen && (
        <div className="modal-layer" role="presentation">
          <div
            className="member-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-title"
          >
            <div className="modal-header">
              <div>
                <span className="modal-icon">
                  <Icon name="calendar-plus" size={19} />
                </span>
                <div>
                  <h2 id="event-title">Create an event</h2>
                  <p>Schedule a gathering for your church community.</p>
                </div>
              </div>
              <button onClick={() => setEventOpen(false)} aria-label="Close">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={createEvent}>
              <div className="form-grid">
                <label className="full-field">
                  <span>Event name</span>
                  <input
                    required
                    value={eventForm.title}
                    onChange={(event) =>
                      setEventForm({ ...eventForm, title: event.target.value })
                    }
                    placeholder="e.g. Sunday Worship"
                  />
                </label>
                <label>
                  <span>Date</span>
                  <input
                    required
                    type="date"
                    value={eventForm.date}
                    onChange={(event) =>
                      setEventForm({ ...eventForm, date: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Category</span>
                  <select
                    value={eventForm.category}
                    onChange={(event) =>
                      setEventForm({
                        ...eventForm,
                        category: event.target.value as ChurchEvent["category"],
                      })
                    }
                  >
                    <option>Worship</option>
                    <option>Groups</option>
                    <option>Youth</option>
                    <option>Community</option>
                    <option>Leadership</option>
                  </select>
                </label>
                <label>
                  <span>Start time</span>
                  <input
                    required
                    type="time"
                    value={eventForm.time}
                    onChange={(event) =>
                      setEventForm({ ...eventForm, time: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>End time</span>
                  <input
                    required
                    type="time"
                    value={eventForm.endTime}
                    onChange={(event) =>
                      setEventForm({
                        ...eventForm,
                        endTime: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  <span>Branch</span>
                  <select
                    value={eventForm.branchId}
                    onChange={(event) =>
                      setEventForm({
                        ...eventForm,
                        branchId: event.target.value,
                      })
                    }
                  >
                    {branches.slice(1).map((branch) => (
                      <option value={branch.id} key={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Location</span>
                  <input
                    required
                    value={eventForm.location}
                    onChange={(event) =>
                      setEventForm({
                        ...eventForm,
                        location: event.target.value,
                      })
                    }
                    placeholder="Room or venue"
                  />
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEventOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Icon name="calendar-plus" size={15} />
                  Create event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

type SettingsSection = "General" | "Branches" | "Team & permissions" | "Notifications" | "Security" | "Integrations"

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? "on" : ""}`}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span />
    </button>
  )
}

function SettingsManager() {
  const [section, setSection] = useState<SettingsSection>("General")
  const [saved, setSaved] = useState(false)
  const [churchName, setChurchName] = useState(CHURCH_NAME)
  const [website, setWebsite] = useState("gracecommunity.church")
  const [timezone, setTimezone] = useState("Europe/London")
  const [notifications, setNotifications] = useState({
    newMember: true,
    largeGift: true,
    weeklySummary: true,
    eventReminder: true,
    failedMessage: true,
    productUpdates: false,
  })
  const [twoFactor, setTwoFactor] = useState(true)
  const [dataError, setDataError] = useState("")

  useEffect(() => {
    apiRequest<{
      churchName?: string
      website?: string
      timezone?: string
      notifications?: typeof notifications
    }>("/settings")
      .then((settings) => {
        if (!settings) return
        setChurchName(CHURCH_NAME)
        if (settings.website !== undefined) setWebsite(settings.website)
        if (settings.timezone) setTimezone(settings.timezone)
        if (settings.notifications) setNotifications(settings.notifications)
      })
      .catch((error) => setDataError(error.message))
  }, [])

  const saveSettings = async () => {
    try {
      await apiRequest("/settings", {
        method: "PUT",
        body: JSON.stringify({
          churchName,
          website,
          timezone,
          notifications,
          twoFactor,
        }),
      })
      setDataError("")
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2400)
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to save settings.",
      )
    }
  }

  const settingsItems: {
    label: SettingsSection
    description: string
    icon: IconName
  }[] = [
    {
      label: "General",
      description: "Organization and regional settings",
      icon: "settings",
    },
    {
      label: "Branches",
      description: "Locations and local details",
      icon: "globe",
    },
    {
      label: "Team & permissions",
      description: "Admins, roles, and access",
      icon: "people",
    },
    {
      label: "Notifications",
      description: "Email and system alerts",
      icon: "bell",
    },
    {
      label: "Security",
      description: "Password and authentication",
      icon: "lock",
    },
    {
      label: "Integrations",
      description: "Connected apps and services",
      icon: "template",
    },
  ]

  return (
    <section className="settings-workspace">
      {dataError && (
        <div className="cloud-error settings-cloud-error">{dataError}</div>
      )}
      <aside className="settings-nav panel">
        <div className="settings-nav-title">WORKSPACE SETTINGS</div>
        {settingsItems.map((item) => (
          <button
            className={section === item.label ? "active" : ""}
            key={item.label}
            onClick={() => setSection(item.label)}
          >
            <span>
              <Icon name={item.icon} size={17} />
            </span>
            <div>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </div>
            <Icon name="arrow" size={14} />
          </button>
        ))}
        <div className="settings-plan">
          <span>GATHER NETWORK</span>
          <strong>Global plan</strong>
          <p>7 branches · 4,860 people</p>
          <button>Manage subscription</button>
        </div>
      </aside>

      <div className="settings-content panel">
        {section === "General" && (
          <>
            <div className="settings-header">
              <div>
                <h2>General settings</h2>
                <p>Manage your church identity and regional preferences.</p>
              </div>
            </div>
            <div className="settings-section">
              <div className="settings-section-copy">
                <h3>Organization profile</h3>
                <p>
                  This information appears across your member communications and
                  reports.
                </p>
              </div>
              <div className="settings-form">
                <div className="organization-logo">
                  <img
                    className="church-logo settings-logo"
                    src={churchLogo}
                    alt={`${CHURCH_NAME} logo`}
                  />
                  <div>
                    <strong>Organization logo</strong>
                    <small>PNG or JPG, up to 2 MB</small>
                  </div>
                  <button>Change logo</button>
                </div>
                <label>
                  <span>Church or organization name</span>
                  <input
                    value={churchName}
                    onChange={(event) => setChurchName(event.target.value)}
                  />
                </label>
                <div className="settings-form-grid">
                  <label>
                    <span>Website</span>
                    <input
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Primary email</span>
                    <input
                      type="email"
                      defaultValue="hello@gracecommunity.church"
                    />
                  </label>
                </div>
                <label>
                  <span>Organization description</span>
                  <textarea
                    rows={3}
                    defaultValue="One church serving communities around the world."
                  />
                </label>
              </div>
            </div>
            <div className="settings-section">
              <div className="settings-section-copy">
                <h3>Regional preferences</h3>
                <p>Set defaults for dates, currency, and local time.</p>
              </div>
              <div className="settings-form">
                <div className="settings-form-grid">
                  <label>
                    <span>Default timezone</span>
                    <select
                      value={timezone}
                      onChange={(event) => setTimezone(event.target.value)}
                    >
                      <option>Europe/London</option>
                      <option>Africa/Nairobi</option>
                      <option>Asia/Singapore</option>
                      <option>America/Toronto</option>
                    </select>
                  </label>
                  <label>
                    <span>Default currency</span>
                    <select defaultValue="USD">
                      <option>USD · US Dollar</option>
                      <option>GBP · British Pound</option>
                      <option>KES · Kenyan Shilling</option>
                      <option>SGD · Singapore Dollar</option>
                      <option>CAD · Canadian Dollar</option>
                    </select>
                  </label>
                  <label>
                    <span>Date format</span>
                    <select defaultValue="DD MMM YYYY">
                      <option>DD MMM YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </label>
                  <label>
                    <span>Primary language</span>
                    <select defaultValue="English">
                      <option>English</option>
                      <option>French</option>
                      <option>Swahili</option>
                      <option>Mandarin</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {section === "Branches" && (
          <>
            <div className="settings-header">
              <div>
                <h2>Branches</h2>
                <p>Manage each location in your global church network.</p>
              </div>
              <button className="primary-button">
                <Icon name="plus" size={15} />
                Add branch
              </button>
            </div>
            <div className="branch-settings-list">
              {branches.slice(1).map((branch, index) => (
                <article key={branch.id}>
                  <span className="branch-settings-code">{branch.code}</span>
                  <div>
                    <strong>{branch.name}</strong>
                    <span>
                      <Icon name="pin" size={11} />
                      {branch.city}
                    </span>
                  </div>
                  <div className="branch-settings-meta">
                    <span>
                      {index === 0 ? "Headquarters" : "Active branch"}
                    </span>
                    <small>{branch.time} local</small>
                  </div>
                  <button>
                    <Icon name="edit" size={15} />
                    Edit
                  </button>
                  <button aria-label={`More options for ${branch.name}`}>
                    <Icon name="more" size={17} />
                  </button>
                </article>
              ))}
            </div>
            <div className="settings-info">
              <Icon name="globe" size={18} />
              <div>
                <strong>Global defaults</strong>
                <p>
                  Each branch can override timezone, currency, language, and
                  communication settings while remaining connected to the global
                  workspace.
                </p>
              </div>
            </div>
          </>
        )}

        {section === "Team & permissions" && (
          <>
            <div className="settings-header">
              <div>
                <h2>Team & permissions</h2>
                <p>Control who can access and manage your church data.</p>
              </div>
              <button className="primary-button">
                <Icon name="user-plus" size={15} />
                Invite admin
              </button>
            </div>
            <div className="team-summary">
              <article>
                <strong>12</strong>
                <span>Administrators</span>
              </article>
              <article>
                <strong>4</strong>
                <span>Custom roles</span>
              </article>
              <article>
                <strong>3</strong>
                <span>Pending invites</span>
              </article>
            </div>
            <div className="settings-table">
              <div className="settings-table-head">
                <span>TEAM MEMBER</span>
                <span>ROLE</span>
                <span>ACCESS</span>
                <span>STATUS</span>
                <span />
              </div>
              {[
                [
                  "MS",
                  "Micah Stone",
                  "micah@grace.church",
                  "Global Administrator",
                  "All branches",
                ],
                [
                  "AK",
                  "Amara King",
                  "amara@grace.church",
                  "Branch Administrator",
                  "Nairobi West",
                ],
                [
                  "DT",
                  "Daniel Tan",
                  "daniel@grace.church",
                  "Finance Manager",
                  "Singapore City",
                ],
                [
                  "EM",
                  "Emily Martinez",
                  "emily@grace.church",
                  "Communications",
                  "London Central",
                ],
              ].map((person, index) => (
                <div className="settings-team-row" key={person[1]}>
                  <div>
                    <span className="avatar">{person[0]}</span>
                    <div>
                      <strong>{person[1]}</strong>
                      <small>{person[2]}</small>
                    </div>
                  </div>
                  <span>{person[3]}</span>
                  <span>{person[4]}</span>
                  <i className={index === 0 ? "owner" : ""}>
                    {index === 0 ? "Owner" : "Active"}
                  </i>
                  <button>
                    <Icon name="more" size={17} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {section === "Notifications" && (
          <>
            <div className="settings-header">
              <div>
                <h2>Notifications</h2>
                <p>
                  Choose which events should notify your administration team.
                </p>
              </div>
            </div>
            <div className="notification-settings">
              <div className="notification-group">
                <h3>Member activity</h3>
                <p>Updates about people joining and connecting.</p>
                {[
                  [
                    "newMember",
                    "New member added",
                    "Notify when a member is added at any branch",
                  ],
                  [
                    "eventReminder",
                    "Event registration activity",
                    "Daily summary of new registrations",
                  ],
                ].map(([key, title, detail]) => (
                  <div className="notification-row" key={key}>
                    <span className="settings-list-icon">
                      <Icon name="people" size={16} />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <small>{detail}</small>
                    </div>
                    <Toggle
                      label={title}
                      checked={
                        notifications[(key as keyof typeof notifications)]
                      }
                      onChange={() =>
                        setNotifications({
                          ...notifications,
                          [key]:
                            !notifications[(key as keyof typeof notifications)],
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="notification-group">
                <h3>Finance & communication</h3>
                <p>Important activity requiring attention.</p>
                {[
                  [
                    "largeGift",
                    "Large gift received",
                    "Notify when a gift is above $1,000",
                  ],
                  [
                    "failedMessage",
                    "Communication delivery issue",
                    "Notify when a campaign has failed deliveries",
                  ],
                  [
                    "weeklySummary",
                    "Weekly ministry summary",
                    "Receive a Monday morning network overview",
                  ],
                  [
                    "productUpdates",
                    "Gather product updates",
                    "New features and product announcements",
                  ],
                ].map(([key, title, detail]) => (
                  <div className="notification-row" key={key}>
                    <span className="settings-list-icon">
                      <Icon
                        name={key === "largeGift" ? "heart" : "bell"}
                        size={16}
                      />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <small>{detail}</small>
                    </div>
                    <Toggle
                      label={title}
                      checked={
                        notifications[(key as keyof typeof notifications)]
                      }
                      onChange={() =>
                        setNotifications({
                          ...notifications,
                          [key]:
                            !notifications[(key as keyof typeof notifications)],
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {section === "Security" && (
          <>
            <div className="settings-header">
              <div>
                <h2>Security</h2>
                <p>Protect your account and global church data.</p>
              </div>
            </div>
            <div className="security-card">
              <span className="security-icon">
                <Icon name="lock" size={19} />
              </span>
              <div>
                <strong>Two-factor authentication</strong>
                <p>Require an additional verification code when signing in.</p>
                <span className="security-status">
                  {twoFactor ? "Enabled" : "Disabled"}
                </span>
              </div>
              <Toggle
                label="Two-factor authentication"
                checked={twoFactor}
                onChange={() => setTwoFactor(!twoFactor)}
              />
            </div>
            <div className="settings-section security-section">
              <div className="settings-section-copy">
                <h3>Change password</h3>
                <p>Use a strong, unique password for this account.</p>
              </div>
              <div className="settings-form">
                <label>
                  <span>Current password</span>
                  <input type="password" placeholder="Enter current password" />
                </label>
                <div className="settings-form-grid">
                  <label>
                    <span>New password</span>
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                    />
                  </label>
                  <label>
                    <span>Confirm password</span>
                    <input type="password" placeholder="Repeat new password" />
                  </label>
                </div>
                <button className="secondary-button settings-inline-button">
                  Update password
                </button>
              </div>
            </div>
            <div className="active-sessions">
              <h3>Active sessions</h3>
              <div>
                <span>
                  <Icon name="globe" size={17} />
                </span>
                <div>
                  <strong>Chrome on macOS</strong>
                  <small>London, United Kingdom · Current session</small>
                </div>
                <i>Active now</i>
              </div>
              <div>
                <span>
                  <Icon name="globe" size={17} />
                </span>
                <div>
                  <strong>Safari on iPhone</strong>
                  <small>London, United Kingdom · 2 hours ago</small>
                </div>
                <button>Sign out</button>
              </div>
            </div>
          </>
        )}

        {section === "Integrations" && (
          <>
            <div className="settings-header">
              <div>
                <h2>Integrations</h2>
                <p>Connect Gather with the tools your ministry already uses.</p>
              </div>
            </div>
            <div className="integration-grid">
              {[
                [
                  "mail",
                  "Mailchimp",
                  "Sync audiences and email campaign activity.",
                  "Connected",
                  "green",
                ],
                [
                  "card",
                  "Stripe",
                  "Receive and reconcile online contributions.",
                  "Connected",
                  "blue",
                ],
                [
                  "calendar",
                  "Google Calendar",
                  "Sync events with branch calendars.",
                  "Connect",
                  "gold",
                ],
                [
                  "message",
                  "Twilio",
                  "Send SMS updates to members worldwide.",
                  "Connect",
                  "clay",
                ],
                [
                  "template",
                  "Planning Center",
                  "Import people and serving schedules.",
                  "Connect",
                  "green",
                ],
                [
                  "reports",
                  "QuickBooks",
                  "Export giving and fund data for accounting.",
                  "Connect",
                  "blue",
                ],
              ].map(([icon, name, detail, action, tone]) => (
                <article key={name}>
                  <span className={`integration-icon ${tone}`}>
                    <Icon name={icon as IconName} size={20} />
                  </span>
                  <div>
                    <strong>{name}</strong>
                    <p>{detail}</p>
                  </div>
                  <button className={action === "Connected" ? "connected" : ""}>
                    {action === "Connected" && <Icon name="check" size={12} />}
                    {action}
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {(section === "General" || section === "Notifications") && (
          <div className="settings-footer">
            <span>Changes apply across your organization.</span>
            <button className="primary-button" onClick={saveSettings}>
              Save changes
            </button>
          </div>
        )}
      </div>
      {saved && (
        <div className="report-toast">
          <span>
            <Icon name="check" size={15} />
          </span>
          <div>
            <strong>Settings saved</strong>
            <small>Your changes are now active.</small>
          </div>
        </div>
      )}
    </section>
  )
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [fullName, setFullName] = useState("")
  const [signupBranchId, setSignupBranchId] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const switchMode = (nextMode: "login" | "signup") => {
    setMode(nextMode)
    setError("")
    setNotice("")
    if (nextMode === "signup") {
      setEmail("")
      setPassword("")
    }
    setConfirmPassword("")
  }

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault()
    if (mode === "signup" && (!fullName.trim() || !signupBranchId)) {
      setError("Enter your name and primary branch to create an account.")
      return
    }
    if (!email.trim() || password.length < 6) {
      setError(
        "Enter a valid email address and a password of at least 6 characters.",
      )
      return
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Your passwords do not match. Please try again.")
      return
    }
    if (mode === "signup" && !acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.")
      return
    }
    setError("")
    setNotice("")
    setSubmitting(true)
    try {
      if (mode === "signup") {
        await signUpAccount({
          email,
          password,
          fullName,
          churchName: CHURCH_NAME,
          branchId: signupBranchId,
        })
        setMode("login")
        setPassword("")
        setConfirmPassword("")
        setAcceptedTerms(false)
        setNotice(
          "Your administrator account was created. Sign in with your new credentials to continue.",
        )
        return
      }
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw authError
      onLogin()
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Unable to authenticate your account.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const resetPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email address before requesting a password reset.")
      return
    }
    setError("")
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: window.location.origin },
    )
    if (resetError) {
      setError(resetError.message)
      return
    }
    setNotice("Password reset instructions have been sent to your email.")
  }

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-story-inner">
          <div className="login-brand">
            <img
              className="church-logo"
              src={churchLogo}
              alt={`${CHURCH_NAME} logo`}
            />
            <div>
              <strong>{CHURCH_NAME}</strong>
              <small>Global church management</small>
            </div>
          </div>
          <div className="login-message">
            <span className="login-kicker">ONE CHURCH · MANY PLACES</span>
            <h1>Serving every community, together.</h1>
            <p>
              Bring your people, giving, events, and communication into one
              connected ministry workspace.
            </p>
          </div>
          <div className="login-network">
            <div className="network-orbit">
              <span className="network-center">
                <img src={churchLogo} alt="" />
              </span>
              <i className="orbit-one" />
              <i className="orbit-two" />
              <i className="orbit-three" />
              <i className="orbit-four" />
            </div>
            <div className="network-locations">
              {branches.slice(1).map((branch) => (
                <span key={branch.id}>
                  <i />
                  {branch.code}
                </span>
              ))}
            </div>
          </div>
          <div className="login-story-footer">
            <span>7 global branches</span>
            <i />
            <span>4,860 weekly attendance</span>
            <i />
            <span>One shared mission</span>
          </div>
        </div>
      </section>

      <section className="login-form-side">
        <div className="login-mobile-brand">
          <img
            className="church-logo"
            src={churchLogo}
            alt={`${CHURCH_NAME} logo`}
          />
          <strong>{CHURCH_NAME}</strong>
        </div>
        <div className={`login-card ${mode === "signup" ? "signup" : ""}`}>
          <div className="auth-mode-switch">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              onClick={() => switchMode("signup")}
            >
              Create account
            </button>
          </div>
          <div className="secure-badge">
            <Icon name="lock" size={14} /> Protected church workspace
          </div>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p>
            {mode === "login"
              ? "Sign in to manage your church community."
              : "Start connecting your church community with Gather."}
          </p>
          <form onSubmit={submitLogin}>
            {mode === "signup" && (
              <div className="signup-fields">
                <label className="signup-name">
                  <span>Your full name</span>
                  <div className="login-input">
                    <Icon name="people" size={17} />
                    <input
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="e.g. Micah Stone"
                      autoComplete="name"
                    />
                  </div>
                </label>
                <label className="signup-branch">
                  <span>Primary branch</span>
                  <div className="login-input">
                    <Icon name="pin" size={17} />
                    <select
                      required
                      value={signupBranchId}
                      onChange={(event) =>
                        setSignupBranchId(event.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select your branch
                      </option>
                      {branches.slice(1).map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} · {branch.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
            )}
            <label>
              <span>Email address</span>
              <div className="login-input">
                <Icon name="mail" size={17} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@church.org"
                  autoComplete="email"
                />
              </div>
            </label>
            <label>
              <span>Password</span>
              <div className="login-input">
                <Icon name="lock" size={17} />
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name="eye" size={16} />
                </button>
              </div>
            </label>
            {mode === "signup" && (
              <label>
                <span>Confirm password</span>
                <div className="login-input">
                  <Icon name="lock" size={17} />
                  <input
                    required
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                  />
                </div>
              </label>
            )}
            <div
              className={`login-options ${
                mode === "signup" ? "terms-options" : ""
              }`}
            >
              <label className="remember-option">
                <button
                  type="button"
                  className={
                    (mode === "login" ? remember : acceptedTerms)
                      ? "checked"
                      : ""
                  }
                  onClick={() =>
                    mode === "login"
                      ? setRemember(!remember)
                      : setAcceptedTerms(!acceptedTerms)
                  }
                  role="checkbox"
                  aria-checked={mode === "login" ? remember : acceptedTerms}
                >
                  {(mode === "login" ? remember : acceptedTerms) && (
                    <Icon name="check" size={12} />
                  )}
                </button>
                <span>
                  {mode === "login" ? (
                    "Remember me"
                  ) : (
                    <>
                      I agree to the <strong>Terms</strong> and{" "}
                      <strong>Privacy Policy</strong>
                    </>
                  )}
                </span>
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  className="forgot-link"
                  onClick={resetPassword}
                >
                  Forgot password?
                </button>
              )}
            </div>
            {error && <div className="login-error">{error}</div>}
            {notice && <div className="login-notice">{notice}</div>}
            <button
              type="submit"
              className="login-submit"
              disabled={submitting}
            >
              {submitting
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in to Gather"
                  : "Create account"}{" "}
              <Icon name="arrow" size={16} />
            </button>
          </form>
          <div className="login-help">
            <span>Need help accessing your workspace?</span>
            <button>Contact support</button>
          </div>
          {mode === "login" && (
            <div className="demo-note">
              <Icon name="lock" size={13} />
              <span>
                Authentication and account sessions are securely managed by{" "}
                <strong>Supabase</strong>.
              </span>
            </div>
          )}
        </div>
        <footer className="login-footer">
          <span>© 2025 {CHURCH_NAME}</span>
          <button>Privacy</button>
          <button>Security</button>
        </footer>
      </section>
    </main>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [activeNav, setActiveNav] = useState("Overview")
  const [tasks, setTasks] = useState<Task[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [branchMenuOpen, setBranchMenuOpen] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState("global")
  const [profile, setProfile] = useState<{
    fullName?: string
    churchName?: string
    email?: string
  } | null>(null)
  const completed = tasks.filter((task) => task.done).length
  const selectedBranch =
    branches.find((branch) => branch.id === selectedBranchId) ?? branches[0]

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session))
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    Promise.all([
      cloudStore.list<Task>("tasks"),
      apiRequest<typeof profile>("/profile"),
    ])
      .then(([cloudTasks, cloudProfile]) => {
        setTasks(cloudTasks)
        setProfile(cloudProfile)
      })
      .catch(() => {
        setTasks([])
      })
  }, [isAuthenticated])

  const toggleTask = async (id: string | number) => {
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
    try {
      await cloudStore.update<Task>("tasks", id, {
        ...target,
        done: !target.done,
      })
    } catch {
      setTasks((current) =>
        current.map((task) => (task.id === id ? target : task)),
      )
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="auth-loading">
        <img
          className="church-logo"
          src={churchLogo}
          alt={`${CHURCH_NAME} logo`}
        />
        <strong>{CHURCH_NAME}</strong>
        <small>Connecting securely...</small>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <img
            className="church-logo sidebar-logo"
            src={churchLogo}
            alt={`${CHURCH_NAME} logo`}
          />
          <div>
            <div className="brand-name">{CHURCH_NAME}</div>
            <div className="brand-caption">Global ministry workspace</div>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              className={`nav-item ${activeNav === item.label ? "active" : ""}`}
              key={item.label}
              onClick={() => {
                setActiveNav(item.label)
                setMenuOpen(false)
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.label === "People" && <span className="nav-badge">12</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${activeNav === "Settings" ? "active" : ""}`}
            onClick={() => {
              setActiveNav("Settings")
              setMenuOpen(false)
            }}
          >
            <Icon name="settings" />
            <span>Settings</span>
          </button>
          <button
            className="profile"
            onClick={async () => {
              await supabase.auth.signOut()
              setIsAuthenticated(false)
            }}
            title="Sign out"
          >
            <div className="avatar avatar-profile">
              {(profile?.fullName ?? "Micah Stone")
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="profile-copy">
              <strong>{profile?.fullName ?? "Micah Stone"}</strong>
              <span>Administrator</span>
            </div>
            <Icon name="more" size={18} />
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-brand"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <img
              className="church-logo mobile-logo"
              src={churchLogo}
              alt={`${CHURCH_NAME} logo`}
            />
          </button>
          <div className="search">
            <Icon name="search" size={18} />
            <input
              aria-label="Search"
              placeholder="Search people, groups, events..."
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              <Icon name="bell" size={19} />
              <span className="notification-dot" />
            </button>
            <div className="divider" />
            <div className="branch-switcher">
              <button
                className="church-switcher"
                onClick={() => setBranchMenuOpen(!branchMenuOpen)}
                aria-expanded={branchMenuOpen}
              >
                <span className="church-symbol">
                  <Icon name="globe" size={15} />
                </span>
                <span>{selectedBranch.name}</span>
                <Icon name="chevron" size={16} />
              </button>
              {branchMenuOpen && (
                <div className="branch-menu">
                  <div className="branch-menu-label">SWITCH BRANCH</div>
                  {branches.map((branch) => (
                    <button
                      className={`branch-option ${
                        selectedBranchId === branch.id ? "selected" : ""
                      }`}
                      key={branch.id}
                      onClick={() => {
                        setSelectedBranchId(branch.id)
                        setBranchMenuOpen(false)
                      }}
                    >
                      <span className="branch-code">{branch.code}</span>
                      <span>
                        <strong>{branch.name}</strong>
                        <small>{branch.city}</small>
                      </span>
                      {selectedBranchId === branch.id && (
                        <Icon name="check" size={15} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">
                {activeNav === "People"
                  ? "DIRECTORY"
                  : activeNav === "Communication"
                    ? "OUTREACH"
                    : activeNav === "Calendar"
                      ? "SCHEDULE"
                      : activeNav === "Giving"
                        ? "GENEROSITY"
                        : activeNav === "Reports"
                          ? "INSIGHTS"
                          : activeNav === "Settings"
                            ? "ADMINISTRATION"
                            : "WEDNESDAY, JUNE 14"}
              </p>
              <h1>
                {activeNav === "People"
                  ? "Member management"
                  : activeNav === "Communication"
                    ? "Communication center"
                    : activeNav === "Calendar"
                      ? "Church calendar"
                      : activeNav === "Giving"
                        ? "Giving"
                        : activeNav === "Reports"
                          ? "Reports & insights"
                          : activeNav === "Settings"
                            ? "Settings"
                            : "Good morning, Micah."}
              </h1>
              <p>
                {activeNav === "People"
                  ? `Add, update, and manage members${
                      selectedBranch.id === "global"
                        ? " across every branch."
                        : ` at ${selectedBranch.name}.`
                    }`
                  : activeNav === "Communication"
                    ? `Create and coordinate messages${
                        selectedBranch.id === "global"
                          ? " across your global church."
                          : ` for ${selectedBranch.name}.`
                      }`
                    : activeNav === "Calendar"
                      ? `Plan gatherings and coordinate ministry${
                          selectedBranch.id === "global"
                            ? " across every branch."
                            : ` for ${selectedBranch.name}.`
                        }`
                      : activeNav === "Giving"
                        ? `Steward generosity and track every gift${
                            selectedBranch.id === "global"
                              ? " across your global church."
                              : ` for ${selectedBranch.name}.`
                          }`
                        : activeNav === "Reports"
                          ? `Turn ministry data into clear, actionable insight${
                              selectedBranch.id === "global"
                                ? " across all branches."
                                : ` for ${selectedBranch.name}.`
                            }`
                          : activeNav === "Settings"
                            ? "Manage your organization, branches, team access, and preferences."
                            : selectedBranch.id === "global"
                              ? "Here’s what’s happening across your global church today."
                              : `Viewing ministry activity for ${selectedBranch.name}.`}
              </p>
            </div>
            {![
              "People",
              "Communication",
              "Calendar",
              "Giving",
              "Reports",
              "Settings",
            ].includes(activeNav) && (
              <button className="primary-button">
                <Icon name="plus" size={18} /> Quick add
              </button>
            )}
          </section>

          {activeNav === "People" && (
            <MemberManager selectedBranchId={selectedBranchId} />
          )}
          {activeNav === "Communication" && (
            <CommunicationManager selectedBranchId={selectedBranchId} />
          )}
          {activeNav === "Calendar" && (
            <CalendarManager selectedBranchId={selectedBranchId} />
          )}
          {activeNav === "Giving" && (
            <GivingManager selectedBranchId={selectedBranchId} />
          )}
          {activeNav === "Reports" && (
            <ReportsManager selectedBranchId={selectedBranchId} />
          )}
          {activeNav === "Settings" && <SettingsManager />}

          <div
            className={
              [
                "People",
                "Communication",
                "Calendar",
                "Giving",
                "Reports",
                "Settings",
              ].includes(activeNav)
                ? "view-hidden"
                : ""
            }
          >
            {activeNav !== "Overview" && activeNav !== "People" && (
              <div className="section-notice">
                <div className="notice-icon">
                  <Icon
                    name={
                      navItems.find((item) => item.label === activeNav)?.icon ??
                      "home"
                    }
                  />
                </div>
                <div>
                  <strong>{activeNav}</strong>
                  <span>This workspace is ready for your ministry data.</span>
                </div>
                <button onClick={() => setActiveNav("Overview")}>
                  Return to overview
                </button>
              </div>
            )}

            <section className="stats-grid">
              <article className="stat-card">
                <div className="stat-top">
                  <span>WEEKLY ATTENDANCE</span>
                  <span className="trend">↑ 8.2%</span>
                </div>
                <div className="stat-value">{selectedBranch.attendance}</div>
                <div className="stat-meta">
                  Last Sunday <span>·</span>{" "}
                  {selectedBranch.id === "global"
                    ? "across 7 branches"
                    : selectedBranch.city}
                </div>
                <div className="sparkline">
                  <svg viewBox="0 0 180 40" preserveAspectRatio="none">
                    <path d="M0 32 C20 34 22 20 42 24 S70 36 88 22 S110 28 130 14 S150 22 180 3" />
                    <path
                      className="spark-fill"
                      d="M0 32 C20 34 22 20 42 24 S70 36 88 22 S110 28 130 14 S150 22 180 3 V40 H0Z"
                    />
                  </svg>
                </div>
              </article>
              <article className="stat-card">
                <div className="stat-top">
                  <span>NEW THIS MONTH</span>
                  <span className="stat-icon">
                    <Icon name="user-plus" size={17} />
                  </span>
                </div>
                <div className="stat-value">{selectedBranch.people}</div>
                <div className="stat-meta">
                  <strong>18</strong> connected to a group
                </div>
                <div className="progress">
                  <span style={{ width: "43%" }} />
                </div>
              </article>
              <article className="stat-card">
                <div className="stat-top">
                  <span>MONTHLY GIVING</span>
                  <span className="trend">↑ 4.6%</span>
                </div>
                <div className="stat-value">{selectedBranch.giving}</div>
                <div className="stat-meta">
                  68% of <strong>$124k goal</strong>
                </div>
                <div className="progress gold">
                  <span style={{ width: "68%" }} />
                </div>
              </article>
              <article className="stat-card">
                <div className="stat-top">
                  <span>ACTIVE GROUPS</span>
                  <span className="stat-icon clay">
                    <Icon name="people" size={17} />
                  </span>
                </div>
                <div className="stat-value">{selectedBranch.groups}</div>
                <div className="stat-meta">
                  <strong>326</strong> people connected
                </div>
                <div className="avatar-stack">
                  <span>JL</span>
                  <span>NK</span>
                  <span>SO</span>
                  <span>+23</span>
                </div>
              </article>
            </section>

            <section className="panel global-network">
              <div className="panel-header network-heading">
                <div>
                  <h2>Global network</h2>
                  <p>One church, serving communities around the world</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setSelectedBranchId("global")}
                >
                  <Icon name="globe" size={15} /> View global
                </button>
              </div>
              <div className="branch-grid">
                {branches.slice(1).map((branch) => (
                  <button
                    className={`branch-card ${
                      selectedBranchId === branch.id ? "active" : ""
                    }`}
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                  >
                    <span className="branch-pin">
                      <Icon name="pin" size={16} />
                    </span>
                    <span className="branch-card-copy">
                      <strong>{branch.name}</strong>
                      <small>{branch.city}</small>
                    </span>
                    <span className="branch-time">
                      <strong>{branch.time}</strong>
                      <small>Local time</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="dashboard-grid">
              <article className="panel schedule-panel">
                <div className="panel-header">
                  <div>
                    <h2>Coming up</h2>
                    <p>Your next seven days</p>
                  </div>
                  <button className="text-button">
                    View calendar <Icon name="arrow" size={16} />
                  </button>
                </div>
                <div className="schedule-list">
                  {schedule.map((event) => (
                    <button className="event-row" key={event.title}>
                      <div className={`date-tile ${event.color}`}>
                        <span>{event.month}</span>
                        <strong>{event.day}</strong>
                      </div>
                      <div className="event-copy">
                        <strong>{event.title}</strong>
                        <span>{event.meta}</span>
                      </div>
                      <Icon name="arrow" size={18} />
                    </button>
                  ))}
                </div>
                <button className="outline-button">
                  <Icon name="calendar-plus" size={17} /> Create an event
                </button>
              </article>

              <article className="panel tasks-panel">
                <div className="panel-header">
                  <div>
                    <h2>My tasks</h2>
                    <p>
                      {completed} of {tasks.length} completed
                    </p>
                  </div>
                  <button
                    className="icon-button quiet"
                    aria-label="More task options"
                  >
                    <Icon name="more" />
                  </button>
                </div>
                <div className="task-progress">
                  <span
                    style={{
                      width: `${
                        tasks.length ? (completed / tasks.length) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="task-list">
                  {tasks.map((task) => (
                    <button
                      className={`task ${task.done ? "done" : ""}`}
                      onClick={() => toggleTask(task.id)}
                      key={task.id}
                    >
                      <span className="checkbox">
                        {task.done && <Icon name="check" size={14} />}
                      </span>
                      <span className="task-copy">
                        <strong>{task.title}</strong>
                        <span>
                          <Icon name="clock" size={13} /> {task.meta}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                <button className="add-task">
                  <Icon name="plus" size={16} /> Add a task
                </button>
              </article>

              <article className="panel activity-panel">
                <div className="panel-header">
                  <div>
                    <h2>People activity</h2>
                    <p>Recent connection moments</p>
                  </div>
                  <button className="text-button">
                    View all <Icon name="arrow" size={16} />
                  </button>
                </div>
                <div className="people-list">
                  {people.map((person) => (
                    <div className="person-row" key={person.name}>
                      <div className={`avatar ${person.tone}`}>
                        {person.initials}
                      </div>
                      <div className="person-copy">
                        <strong>{person.name}</strong>
                        <span>{person.detail}</span>
                      </div>
                      <time>{person.time}</time>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel engagement-panel">
                <div className="panel-header">
                  <div>
                    <h2>Network pulse</h2>
                    <p>
                      {selectedBranch.id === "global"
                        ? "Engagement across all branches"
                        : `${selectedBranch.name} engagement`}
                    </p>
                  </div>
                  <button className="period-button">
                    6 weeks <Icon name="chevron" size={15} />
                  </button>
                </div>
                <div className="chart-wrap">
                  <div className="chart-labels">
                    <span>1.5k</span>
                    <span>1k</span>
                    <span>500</span>
                    <span>0</span>
                  </div>
                  <div className="chart">
                    {[62, 71, 66, 82, 76, 90].map((height, index) => (
                      <div className="bar-column" key={index}>
                        <div className="bar-track">
                          <span style={{ height: `${height}%` }} />
                        </div>
                        <small>W{index + 1}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chart-summary">
                  <span>
                    <i /> Attendance
                  </span>
                  <strong>+12.4%</strong>
                  <span>from previous period</span>
                </div>
              </article>
            </section>
          </div>
        </div>
      </main>
      {menuOpen && (
        <button
          className="scrim"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}
    </div>
  )
}

export default App
