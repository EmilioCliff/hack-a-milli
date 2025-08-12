package pkg

import "strings"

type Path struct {
	Trailing bool
	Segments []Segment
}

// Segment represents one part of a path between "/" characters
type Segment struct {
	IsParam bool   // true if this segment captures a parameter (starts with ":")
	Param   string // parameter name (without the ":") if IsParam is true
	Const   string // literal string value if IsParam is false
}

type Match struct {
	Params   map[string]string
	Trailing string
}

// Matcher parses a path pattern string into a Path struct
// Examples:
//   - "/users/:id" -> segments for "users" (const) and ":id" (param), no trailing
//   - "/api/v1/*" -> segments for "api", "v1", with trailing enabled
//   - "/static" -> single "static" segment, no trailing
func Matcher(path string) Path {
	inSegments := strings.Split(path, "/")

	// Check if the last segment is "*" which indicates trailing wildcard support
	trailing := inSegments[len(inSegments)-1] == "*"

	var outSegments []Segment
	if trailing {
		outSegments = make([]Segment, len(inSegments)-1)
	} else {
		outSegments = make([]Segment, len(inSegments))
	}

	for i := 0; i < len(outSegments); i++ {
		if strings.HasPrefix(inSegments[i], ":") {
			outSegments[i] = Segment{IsParam: true, Param: inSegments[i][1:]}
		} else {
			outSegments[i] = Segment{IsParam: false, Const: inSegments[i]}
		}
	}

	return Path{Segments: outSegments, Trailing: trailing}
}

// Match attempts to match a given URL string against this Path pattern
// Returns (Match, true) on success or (Match{}, false) on failure
//
// Examples:
//
//	Path("/users/:id").Match("/users/123") -> Match{Params: {"id": "123"}}, true
//	Path("/users/:id").Match("/users/123/posts") -> Match{}, false (no trailing allowed)
//	Path("/api/*").Match("/api/v1/users") -> Match{Trailing: "v1/users"}, true
func (p *Path) Match(s string) (Match, bool) {
	params := map[string]string{}

	for segmentIndex, segment := range p.Segments {
		i := strings.IndexByte(s, '/')
		j := i + 1
		if i == -1 {
			i = len(s)
			j = len(s)

			if segmentIndex != len(p.Segments)-1 || p.Trailing {
				return Match{}, false
			}
		} else {
			if segmentIndex == len(p.Segments)-1 && !p.Trailing {
				return Match{}, false
			}
		}

		if segment.IsParam {
			params[segment.Param] = s[:i]
		} else {
			if s[:i] != segment.Const {
				return Match{}, false
			}
		}

		s = s[j:]
	}

	return Match{Params: params, Trailing: s}, true
}

// Build constructs a URL string from a Match struct using this Path pattern
// Returns (url, true) on success or ("", false) if required parameters are missing
//
// Examples:
//
//	Path("/users/:id").Build(Match{Params: {"id": "123"}}) -> "/users/123", true
//	Path("/api/*").Build(Match{Trailing: "v1/users"}) -> "/api/v1/users", true
//	Path("/users/:id").Build(Match{Params: {"name": "john"}}) -> "", false (missing "id")
func (p *Path) Build(m Match) (string, bool) {
	var s strings.Builder

	for i, segment := range p.Segments {
		if segment.IsParam {
			if param, ok := m.Params[segment.Param]; ok {
				s.WriteString(param)
			} else {
				return "", false
			}
		} else {
			s.WriteString(segment.Const)
		}

		if i != len(p.Segments)-1 {
			s.WriteRune('/')
		}
	}

	if p.Trailing && len(p.Segments) > 0 {
		s.WriteRune('/')
	}

	s.WriteString(m.Trailing)

	return s.String(), true
}
