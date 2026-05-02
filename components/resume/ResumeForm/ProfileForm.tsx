import { BaseForm } from "@/components/resume/ResumeForm/Form";
import { Input, Textarea } from "@/components/resume/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "@/lib/resume/redux/hooks";
import { changeProfile, selectProfile } from "@/lib/resume/redux/resumeSlice";
import { ResumeProfile, ProfileLink } from "@/lib/resume/redux/types";
import { Plus, X } from "lucide-react";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, summary, location, personalLinks = [] } = profile;

  const handleProfileChange = (field: keyof ResumeProfile, value: any) => {
    dispatch(changeProfile({ field, value }));
  };

  const addLink = () => {
    handleProfileChange("personalLinks", [...personalLinks, { label: "", url: "" }]);
  };

  const removeLink = (idx: number) => {
    const newLinks = [...personalLinks];
    newLinks.splice(idx, 1);
    handleProfileChange("personalLinks", newLinks);
  };

  const updateLink = (idx: number, field: "label" | "url", value: string) => {
    const newLinks = [...personalLinks];
    newLinks[idx] = { ...newLinks[idx], [field]: value };
    handleProfileChange("personalLinks", newLinks);
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="FFFSTANZA"
          value={name}
          onChange={handleProfileChange}
        />
        <Textarea
          label="Objective"
          labelClassName="col-span-full"
          name="summary"
          placeholder="Entrepreneur and educator obsessed with making education free for anyone"
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label="Email"
          labelClassName="col-span-4"
          name="email"
          placeholder="fffstanza@gmail.com"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="Phone"
          labelClassName="col-span-2"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label="Location"
          labelClassName="col-span-2"
          name="location"
          placeholder="NYC, NY"
          value={location}
          onChange={handleProfileChange}
        />
        <Input
          label="Website (Legacy)"
          labelClassName="col-span-4"
          name="url"
          placeholder="linkedin.com/in/folonite"
          value={url}
          onChange={handleProfileChange}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-gray-900 border-b pb-1">Personal Links</label>
          <button
            type="button"
            onClick={addLink}
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>

        {personalLinks.map((link, idx) => (
          <div key={idx} className="flex items-start gap-2 relative bg-gray-50 border border-gray-200 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <Input
                label="Display Label"
                name="label"
                placeholder="Portfolio, GitHub, etc."
                value={link.label}
                onChange={(_, v) => updateLink(idx, "label", v as string)}
              />
              <Input
                label="Full URL"
                name="url"
                placeholder="https://github.com/..."
                value={link.url}
                onChange={(_, v) => updateLink(idx, "url", v as string)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeLink(idx)}
              className="mt-7 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              aria-label="Remove link"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        {personalLinks.length === 0 && (
          <div className="text-sm text-gray-500 py-2">
            No links added. Click 'Add Link' to add custom hyperlinks.
          </div>
        )}
      </div>
    </BaseForm>
  );
};
